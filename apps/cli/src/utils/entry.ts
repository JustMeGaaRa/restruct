import fs from "fs-extra";
import path from "node:path";
import { pathToFileURL } from "node:url";

export function detectModuleEntry(cwd: string): string {
    const pkgPath = path.join(cwd, "package.json");
    if (fs.existsSync(pkgPath)) {
        try {
            const pkg = fs.readJSONSync(pkgPath);
            if (pkg.source && fs.existsSync(path.join(cwd, pkg.source))) {
                return pkg.source;
            }
            if (pkg.main && fs.existsSync(path.join(cwd, pkg.main))) {
                return pkg.main;
            }
            if (pkg.exports && pkg.exports["."]) {
                const exp = pkg.exports["."];
                const candidate =
                    typeof exp === "string"
                        ? exp
                        : exp.import || exp.require || exp.default;
                if (candidate && fs.existsSync(path.join(cwd, candidate))) {
                    return candidate;
                }
            }
        } catch (e) {
            // Ignore corrupted package.json
        }
    }

    const fallbacks = [
        "index.ts",
        "workspace.ts",
        "workspaces/index.ts",
        "workspaces/workspace.ts",
    ];

    for (const fallback of fallbacks) {
        if (fs.existsSync(path.join(cwd, fallback))) {
            return fallback;
        }
    }

    const checkedPaths = [
        "package.json (source, main, or exports fields)",
        ...fallbacks.map((f) => `./${f}`),
    ];

    throw new Error(
        `Could not find project entry point in ${cwd}\n` +
            `\nWe checked the following locations:\n` +
            checkedPaths.map((p) => `  • ${p}`).join("\n") +
            `\n\nHints:\n` +
            `  • Are you running this command in the correct directory?\n` +
            `  • Create an entry point file at ./workspaces/index.ts\n` +
            `  • Or specify a "source" or "main" field in your package.json.`
    );
}

/**
 * Resolves the entry point relative to `cwd` and returns an absolute
 * `file://` URL string that is safe to pass to `import()` regardless of
 * where the CLI binary is installed.
 *
 * Using a plain relative path (e.g. `./workspaces/index.ts`) would be
 * resolved against the *caller module's* location inside the CLI's own
 * `dist/` directory instead of the user's project directory.
 */
export function getAbsoluteImportUrl(cwd: string, entryPoint: string): string {
    const absolutePath = path.resolve(cwd, entryPoint);
    return pathToFileURL(absolutePath).href;
}
