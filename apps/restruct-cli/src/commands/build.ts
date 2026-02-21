import { build } from "esbuild";
import fs from "fs-extra";
import path from "path";
import chalk from "chalk";
import ora from "ora";
import { fileURLToPath } from "url";
import { getEntryPoint } from "../utils/entry.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const packageRoot = path.resolve(__dirname, "../");

export const buildCommand = async () => {
    const spinner = ora("Building project...").start();
    try {
        // 1. Clean dist of the user's project
        const userDist = path.join(process.cwd(), "dist");
        fs.removeSync(userDist);
        fs.ensureDirSync(userDist);

        // 2. Copy preview app
        const previewSrc = path.join(packageRoot, "dist", "preview");
        if (!fs.existsSync(previewSrc)) {
            throw new Error(
                `Preview app not found at ${previewSrc}. Did you run 'pnpm build' in restruct-cli?`
            );
        }
        fs.copySync(previewSrc, userDist);

        // 3. Bundle workspace file
        let entryPoint: string;
        try {
            entryPoint = getEntryPoint(process.cwd());
        } catch (e: any) {
            throw new Error(e.message);
        }

        const tempEntry = path.join(process.cwd(), ".restruct-temp-entry.ts");
        let importPath = entryPoint.startsWith(".")
            ? entryPoint
            : `./${entryPoint}`;
        importPath = importPath.replace(/\\/g, "/");

        const entryContent = `
import "${importPath}";
import { workspaceRegistry } from "@structurizr/dsl";

const workspaces = workspaceRegistry.getWorkspaces();
if (workspaces.length > 0) {
    const ws = workspaces[0];
    window.__WORKSPACE__ = ws.toSnapshot ? ws.toSnapshot() : ws;
}
`;
        fs.writeFileSync(tempEntry, entryContent);

        await build({
            entryPoints: [tempEntry],
            bundle: true,
            outfile: path.join(userDist, "assets", "workspace.js"),
            format: "iife",
            globalName: "workspaceBundle",
            platform: "browser",
            external: [], // bundle everything that's not native
        });

        fs.unlinkSync(tempEntry);

        // 4. Update index.html
        const indexHtmlPath = path.join(userDist, "index.html");
        let html = fs.readFileSync(indexHtmlPath, "utf-8");
        // Inject workspace.js before the main script or head close
        // The main script is module, workspace.js sets global.
        // It's safer to load workspace.js first.
        html = html.replace(
            "</head>",
            '<script src="./assets/workspace.js"></script></head>'
        );
        fs.writeFileSync(indexHtmlPath, html);

        spinner.succeed(chalk.green("Build completed successfully!"));
        console.log(chalk.blue(`\nPreview available in: ${userDist}`));
        console.log(`You can serve it with: npx http-server dist\n`);
    } catch (err) {
        spinner.fail(chalk.red("Build failed."));
        console.error(err);
        process.exit(1);
    }
};
