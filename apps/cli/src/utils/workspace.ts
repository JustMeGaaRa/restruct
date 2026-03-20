import fs from "node:fs";
import path from "node:path";
import glob from "fast-glob";
import * as esbuild from "esbuild";

/**
 * Scans a directory for TypeScript files that define a workspace.
 * @param rootDir The base directory of the monorepo.
 * @returns A map where the key is the workspace name and the value is the absolute file path.
 */
export function detectWorkspaceEntries(rootDir: string): Map<string, string> {
    const workspaceMap: Map<string, string> = new Map();

    // 1. Find all .ts files, excluding node_modules and common build folders
    const files = glob.globSync("**/*.ts", {
        cwd: rootDir,
        absolute: true,
        ignore: ["**/node_modules/**", "**/dist/**", "**/out/**"],
    });

    // Regex breakdown:
    // IMPORT: Looks for 'workspace' inside an import statement
    // CALL:   Looks for 'workspace(' followed by a quoted string (the 1st param)
    const IMPORT_PATTERN = /import\s+.*?\bworkspace\b.*?from/s;
    const CALL_PATTERN = /workspace\s*\(\s*(['"`])(.*?)\1/;

    for (const filePath of files) {
        const content = fs.readFileSync(filePath, "utf8");

        // Requirement 1: Must have the import
        if (IMPORT_PATTERN.test(content)) {
            // Requirement 2: Must call the function and extract the first argument
            const match = content.match(CALL_PATTERN);

            if (match) {
                const workspaceName = match[2]!; // The captured string inside quotes

                if (workspaceMap.has(workspaceName)) {
                    console.warn(
                        `[Warning] Duplicate workspace name "${workspaceName}" found at: ${filePath}`
                    );
                }

                workspaceMap.set(workspaceName, filePath);
            }
        }
    }

    return workspaceMap;
}

export async function generateWorkspaceMap(
    rootDir: string,
    workspaceEntriesMap: Map<string, string>,
    result: esbuild.BuildResult
) {
    if (!result.metafile) {
        throw new Error("Metafile is missing from esbuild result.");
    }

    const workspaceMap: Map<string, Set<string>> = new Map();
    const inputs = result.metafile.inputs;

    /**
     * Recursively collects transitive dependencies for a given file from the metafile.
     */
    function collectDependencies(relPath: string, visited: Set<string>): void {
        if (visited.has(relPath)) return;
        visited.add(relPath);

        const input = inputs[relPath];
        if (!input) return;

        for (const imp of input.imports) {
            // imp.path is the key in result.metafile.inputs
            if (imp.path && inputs[imp.path]) {
                collectDependencies(imp.path, visited);
            }
        }
    }

    for (const [workspaceName, absoluteEntryFile] of workspaceEntriesMap) {
        const entryRelPath = path
            .relative(rootDir, absoluteEntryFile)
            .replace(/\\/g, "/");

        const visited = new Set<string>();
        collectDependencies(entryRelPath, visited);

        const dependencies = new Set<string>();
        for (const relPath of visited) {
            const absolutePath = path.resolve(rootDir, relPath);
            // Ensure we aren't accidentally including node_modules
            if (!absolutePath.includes("node_modules")) {
                dependencies.add(absolutePath);
            }
        }

        workspaceMap.set(workspaceName, dependencies);
    }

    return workspaceMap;
}
