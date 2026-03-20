import { build } from "esbuild";
import * as fs from "node:fs";
import * as path from "node:path";
import chalk from "chalk";
import ora from "ora";
import { fileURLToPath } from "node:url";
import { detectModuleEntry } from "../utils/entry.js";
import { createEntryScript } from "../utils/wrapper.js";
import { Command } from "commander";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const packageRoot = path.resolve(__dirname, "../");

export const buildCommand = async () => {
    const spinner = ora("Building project...").start();
    try {
        // 1. Clean dist of the user's project
        const userDist = path.join(process.cwd(), "dist");
        fs.rmSync(userDist);
        fs.mkdirSync(userDist);

        // 2. Copy preview app
        const previewSrc = path.join(packageRoot, "dist", "preview");
        if (!fs.existsSync(previewSrc)) {
            throw new Error(
                `Preview app not found at ${previewSrc}. Did you run 'pnpm build' in restruct-cli?`
            );
        }
        fs.cpSync(previewSrc, userDist);

        // 3. Bundle workspace file
        let entryPoint: string;
        try {
            entryPoint = detectModuleEntry(process.cwd());
        } catch (e: any) {
            throw new Error(e.message);
        }

        const tempEntry = path.join(process.cwd(), ".restruct-temp-entry.ts");
        let importPath = entryPoint.startsWith(".")
            ? entryPoint
            : `./${entryPoint}`;
        importPath = importPath.replace(/\\/g, "/");

        const entryScriptContent = createEntryScript(importPath);
        fs.writeFileSync(tempEntry, entryScriptContent);

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
    } catch (err: unknown) {
        spinner.fail(chalk.red("Build failed."));
        console.error(err instanceof Error ? err.message : err);
        process.exit(1);
    }
};

export function createBuildCommand(): Command {
    const cmd = new Command("build");

    cmd.description("Build the static site").action(buildCommand);

    return cmd;
}
