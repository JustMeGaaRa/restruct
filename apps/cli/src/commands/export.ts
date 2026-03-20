import { Command, Option } from "commander";
import { mkdirSync, existsSync, writeFileSync } from "node:fs";
import { resolve, join } from "node:path";
import chalk from "chalk";
import ora from "ora";
import { IWorkspace, IWorkspaceMetadata } from "@restruct/structurizr-dsl";
import { detectModuleEntry } from "../utils/entry.js";
import { loadWorkspaceModule } from "../utils/module.js";

export type OutputFormat = "json" | "svg" | "dsl";

export interface ExportOptions {
    format: OutputFormat;
    output?: string;
    pretty: boolean;
    filter?: string;
    meta?: boolean;
}

export interface ExportOutput {
    output: string;
    format: OutputFormat;
    pretty: boolean;
    filename: string;
}

function toJson(workspace: IWorkspace, pretty: boolean): ExportOutput {
    const output = JSON.stringify(workspace, null, pretty ? 2 : 0);
    return {
        output,
        format: "json",
        pretty,
        filename: `${workspace.name}.json`,
    };
}

function toMetaJson(meta: IWorkspaceMetadata[], pretty: boolean): ExportOutput {
    const wrapper = { workspaces: meta };
    const output = JSON.stringify(wrapper, null, pretty ? 2 : 0);
    return { output, format: "json", pretty, filename: "workspaces.meta.json" };
}

function toSvg(workspace: IWorkspace, pretty: boolean): ExportOutput {
    const output = "Exporting to SVG...";
    return { output, format: "svg", pretty, filename: `${workspace.name}.svg` };
}

function toDsl(workspace: IWorkspace, pretty: boolean): ExportOutput {
    const output = "Exporting to DSL...";
    return { output, format: "dsl", pretty, filename: `${workspace.name}.dsl` };
}

function formatWorkspaces(
    workspaces: IWorkspace[],
    meta: IWorkspaceMetadata[],
    options: ExportOptions
): ExportOutput[] {
    const outputs: ExportOutput[] = [];

    for (const workspace of workspaces) {
        switch (options.format) {
            case "json":
                outputs.push(toJson(workspace, options.pretty));
                break;
            case "svg":
                outputs.push(toSvg(workspace, options.pretty));
                break;
            case "dsl":
                outputs.push(toDsl(workspace, options.pretty));
                break;
        }
    }

    if (options.meta) {
        outputs.push(toMetaJson(meta, options.pretty));
    }

    return outputs;
}

const exportCommand = async (opts: ExportOptions) => {
    const spinner = ora("Loading workspaces...").start();
    try {
        const entryPoint = detectModuleEntry(process.cwd());
        const { workspaces, meta } = await loadWorkspaceModule(
            process.cwd(),
            entryPoint
        );

        spinner.text = "Formatting workspaces...";
        const outputs = formatWorkspaces(workspaces, meta, opts);

        if (outputs.length > 0) {
            spinner.text = "Exporting workspaces...";
            const outDir = opts.output ? resolve(opts.output) : process.cwd();
            const targetDirectory = join(outDir, "exports");

            if (!existsSync(targetDirectory)) {
                mkdirSync(targetDirectory, { recursive: true });
            }

            outputs.map((output) => {
                const dest = resolve(targetDirectory, output.filename);
                writeFileSync(dest, output.output, "utf-8");
            });

            spinner.succeed(
                chalk.green(
                    `Exported ${workspaces.length} workspaces to ${chalk.bold(targetDirectory)}`
                )
            );

            console.log(chalk.blue(`\nExport details:`));
            outputs.forEach((output) => {
                console.log(`  ${chalk.gray("→")} ${output.filename}`);
            });
            console.log(); // Add a blank line for readability
        } else {
            spinner.warn(chalk.yellow("No workspaces found to export."));
        }
    } catch (err: unknown) {
        spinner.fail(chalk.red("Export failed."));
        console.error(err instanceof Error ? err.message : err);
        process.exit(1);
    }
};

export function createExportCommand(): Command {
    const cmd = new Command("export");

    cmd.description("Export the project to a defined output format")
        .addOption(
            new Option("-f, --format <format>", "Output format")
                .choices(["json"] satisfies OutputFormat[])
                .default("json" satisfies OutputFormat)
        )
        .option("-p, --pretty", "Pretty-print output", false)
        .option("--meta", "Include metadata", true)
        .action(exportCommand);

    return cmd;
}
