import fs from "fs-extra";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { build } from "esbuild";
import type { IWorkspace, IWorkspaceMetadata } from "@restruct/structurizr-dsl";
import { getGitMetadataForFiles } from "./git.js";
import { detectWorkspaceEntries, generateWorkspaceMap } from "./workspace.js";

/**
 * Generates the source of the inline wrapper script that esbuild uses as its
 * entry point.
 *
 * The wrapper:
 *  1. Imports the user's entry point as a **relative path** (so esbuild
 *     follows and bundles all local TypeScript into the output). A `file://`
 *     URL would NOT be followed by esbuild's bundler — only relative or
 *     bare-specifier imports are traversed.
 *  2. Imports `workspaceRegistry` from `@restruct/structurizr-dsl` (kept
 *     external, resolved from the user's node_modules at runtime).
 *  3. Re-exports `workspaceRegistry` so the CLI host can read it directly from
 *     the dynamic import result without any shared-singleton tricks.
 *
 * @param cwd        The user's project root (where the wrapper file is written)
 * @param entryPoint The entry point relative to `cwd` (e.g. `workspaces/index.ts`)
 */
function createWrapperScript(cwd: string, entryPoint: string): string {
    const rel = (
        entryPoint.startsWith("./") || entryPoint.startsWith("../")
            ? entryPoint
            : `./${entryPoint}`
    ).replace(/\\/g, "/");

    return (
        [
            `import { workspaceRegistry } from "@restruct/structurizr-dsl";`,
            `const workspaceSources = new Map();`,
            `const originalRegister = workspaceRegistry.register.bind(workspaceRegistry);`,
            `workspaceRegistry.register = (workspace) => {`,
            `    if (globalThis.__restruct_current_source) {`,
            `        workspaceSources.set(workspace, globalThis.__restruct_current_source);`,
            `    }`,
            `    originalRegister(workspace);`,
            `};`,
            ``,
            `await import("${rel}");`,
            ``,
            `export { workspaceRegistry, workspaceSources };`,
        ].join("\n") + "\n"
    );
}

/** Shape of the module exported by the bundled wrapper. */
interface WorkspaceBundle {
    workspaceRegistry: {
        getWorkspaces(): IWorkspace[];
        getMeta(): IWorkspaceMetadata[];
    };
    workspaceSources: Map<IWorkspace, string>;
}

/**
 * Dynamically transpiles the user's TypeScript workspace module and returns
 * the registered workspaces.
 *
 * ## How it works
 *
 * 1. **Wrapper** — An inline wrapper script is written to a temp `.ts` file.
 *    It imports the user's entry point (so esbuild can follow and bundle all
 *    local TS) and re-exports `workspaceRegistry` from `@restruct/structurizr-dsl`.
 *
 * 2. **Bundle** — esbuild bundles the wrapper with `packages: "external"`.
 *    The user's TypeScript is inlined; npm packages (including
 *    `@restruct/structurizr-dsl`) stay as bare-specifier imports resolved
 *    from the user's own `node_modules` at runtime.
 *
 * 3. **Execute** — The bundle is written to a temp `.mjs` file inside `cwd`
 *    (giving Node a real filesystem base for `node_modules` resolution) and
 *    dynamically imported. The CLI reads `workspaceRegistry` directly from
 *    the module's exports — no singleton-sharing concerns, since we use the
 *    exact instance that the user's workspace code registered into.
 *
 * 4. **Cleanup** — Both temp files are always removed in a `finally` block.
 *
 * @param cwd         - The user's project root (anchors module resolution)
 * @param entryPoint  - A path relative to `cwd` (e.g. `workspaces/index.ts`)
 * @returns           - The list of workspaces registered by the user's module
 * @throws A descriptive {@link Error} with troubleshooting hints on failure
 */
export async function loadWorkspaceModule(
    cwd: string,
    entryPoint: string
): Promise<{ workspaces: IWorkspace[]; meta: IWorkspaceMetadata[] }> {
    const absoluteEntryPath = path.resolve(cwd, entryPoint);

    // Temp file paths — dot-prefixed so they are hidden/ignored by globs.
    const tempWrapper = path.join(cwd, ".restruct-wrapper.ts");
    const tempBundle = path.join(cwd, ".restruct-bundle.mjs");

    // --- Step 1: Write inline wrapper ---
    await fs.writeFile(
        tempWrapper,
        createWrapperScript(cwd, entryPoint),
        "utf-8"
    );

    // --- Step 2: Bundle with esbuild ---
    let buildResult;
    try {
        buildResult = await build({
            entryPoints: [tempWrapper],
            outfile: tempBundle,
            bundle: true,
            write: true,
            format: "esm",
            platform: "node",
            target: "node18",
            packages: "external",
            absWorkingDir: cwd,
            metafile: true,
        });
    } catch (err: unknown) {
        // Wrapper is no longer needed after build attempt.
        await fs.remove(tempWrapper).catch(() => {});

        const lines = [
            `Failed to transpile workspace module: ${absoluteEntryPath}`,
        ];

        if (err instanceof Error) {
            lines.push(`  Reason: ${err.message}`);

            if (
                err.message.includes("Could not resolve") ||
                err.message.includes("Cannot find")
            ) {
                lines.push(
                    "",
                    "  Hints:",
                    "    • A module imported by your workspace file could not be resolved.",
                    "    • Run: npm install  (or pnpm / yarn) to restore missing packages.",
                    "    • Check that local import paths use the correct relative path and",
                    "      file extension (.ts / .js / .mjs).",
                    "    • Path aliases (e.g. '@/') are not supported — use relative imports."
                );
            } else if (
                err.message.includes("Transform failed") ||
                err.message.includes("SyntaxError")
            ) {
                lines.push(
                    "",
                    "  Hints:",
                    "    • Your workspace file (or one of its imports) contains a syntax error.",
                    "    • Run:  tsc --noEmit  to get the full TypeScript error list.",
                    "    • esbuild error details are included in the reason above."
                );
            } else {
                lines.push(
                    "",
                    "  Hints:",
                    "    • Check the error message above for clues.",
                    "    • Ensure the entry point path is correct and the file exists."
                );
            }
        } else {
            lines.push(`  Unknown error: ${String(err)}`);
        }

        throw new Error(lines.join("\n"));
    } finally {
        await fs.remove(tempWrapper).catch(() => {});
    }

    // --- Step 3: Execute the bundle and read exported workspaceRegistry ---
    try {
        const module: WorkspaceBundle = await import(
            pathToFileURL(tempBundle).href
        );
        const workspaces = module.workspaceRegistry.getWorkspaces();
        const workspaceMeta = module.workspaceRegistry.getMeta();

        const workspaceEntriesMap = await detectWorkspaceEntries(cwd);
        const workspaceMap = await generateWorkspaceMap(
            cwd,
            workspaceEntriesMap,
            buildResult
        );

        for (const meta of workspaceMeta) {
            if (workspaceMap.has(meta.name)) {
                const sources = workspaceMap.get(meta.name)!;
                const gitMeta = await getGitMetadataForFiles(
                    cwd,
                    Array.from(sources)
                );
                meta.authors = gitMeta.authors;
                meta.lastModifiedDate =
                    gitMeta.lastModifiedDate ?? meta.lastModifiedDate;
            }
        }

        return { workspaces, meta: workspaceMeta };
    } catch (err: unknown) {
        const lines = [
            `Failed to execute workspace module: ${absoluteEntryPath}`,
        ];

        if (err instanceof Error) {
            lines.push(`  Reason: ${err.message}`);

            const code = (err as NodeJS.ErrnoException).code;
            if (
                code === "ERR_MODULE_NOT_FOUND" ||
                code === "MODULE_NOT_FOUND"
            ) {
                lines.push(
                    "",
                    "  Hints:",
                    "    • A runtime dependency could not be found.",
                    "    • Run: npm install  to restore missing packages."
                );
            } else {
                lines.push(
                    "",
                    "  Hints:",
                    "    • Check the error message and stack trace for the failing line.",
                    "    • Run 'node --trace-warnings' for a more detailed stack trace."
                );
            }

            if (err.stack) {
                lines.push(
                    "",
                    "  Stack trace:",
                    ...err.stack.split("\n").map((l) => `    ${l}`)
                );
            }
        } else {
            lines.push(`  Unknown error: ${String(err)}`);
        }

        throw new Error(lines.join("\n"));
    } finally {
        // Always remove the bundle — even if execution throws.
        await fs.remove(tempBundle).catch(() => {});
    }
}
