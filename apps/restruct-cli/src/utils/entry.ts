import fs from "fs-extra";
import path from "path";

export function getEntryPoint(cwd: string): string {
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
        "workspaces/index.ts",
        "index.ts",
        "workspaces/workspace.ts",
        "workspace.ts",
    ];

    for (const fallback of fallbacks) {
        if (fs.existsSync(path.join(cwd, fallback))) {
            return fallback;
        }
    }

    throw new Error(
        "Could not find project entry point (e.g. src/index.ts, workspace.ts) in " +
            cwd
    );
}
