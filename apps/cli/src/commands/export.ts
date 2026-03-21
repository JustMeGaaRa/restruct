import { Command, Option } from "commander";
import { mkdirSync, existsSync, writeFileSync } from "node:fs";
import { resolve, join, dirname } from "node:path";
import chalk from "chalk";
import ora from "ora";
import {
    IWorkspace,
    IWorkspaceMetadata,
    WorkspaceDslExporter,
} from "@restruct/structurizr-dsl";
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
    outputContent: string;
    format: OutputFormat;
    pretty: boolean;
    relativeFilePath: string;
}

function sanitizeWorkspaceName(name: string | undefined): string {
    if (!name) return "workspace";
    return name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9\-_]/g, "");
}

function toJson(workspace: IWorkspace, pretty: boolean): ExportOutput {
    const workspaceName = sanitizeWorkspaceName(workspace.name);
    const output = JSON.stringify(workspace, null, pretty ? 2 : 0);
    return {
        outputContent: output,
        format: "json",
        pretty,
        relativeFilePath: join(workspaceName, `${workspace.name}.json`),
    };
}

function toMetaJson(meta: IWorkspaceMetadata[], pretty: boolean): ExportOutput {
    const wrapper = { workspaces: meta };
    const output = JSON.stringify(wrapper, null, pretty ? 2 : 0);
    return {
        outputContent: output,
        format: "json",
        pretty,
        relativeFilePath: "workspaces.json",
    };
}

function toSvg(workspace: IWorkspace, pretty: boolean): ExportOutput {
    const output = "Exporting to SVG...";
    return {
        outputContent: output,
        format: "svg",
        pretty,
        relativeFilePath: `${workspace.name}.svg`,
    };
}

function toDsl(workspace: IWorkspace): ExportOutput {
    const workspaceName = sanitizeWorkspaceName(workspace.name);
    const output = new WorkspaceDslExporter().export(workspace);
    return {
        outputContent: output,
        format: "dsl",
        pretty: false,
        relativeFilePath: join(workspaceName, `${workspace.name}.dsl`),
    };
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
                outputs.push(toDsl(workspace));
                break;
        }
    }

    if (options.meta) {
        outputs.push(toMetaJson(meta, options.pretty));
    }

    return outputs;
}

const exportCommand = async (options: ExportOptions) => {
    const spinner = ora("Loading workspaces...").start();
    try {
        const entryPoint = detectModuleEntry(process.cwd());
        const { workspaces, meta } = await loadWorkspaceModule(
            process.cwd(),
            entryPoint
        );

        spinner.text = "Formatting workspaces...";
        const outputs = formatWorkspaces(workspaces, meta, options);

        if (outputs.length > 0) {
            spinner.text = "Exporting workspaces...";
            const outputDirectory = options.output
                ? resolve(options.output)
                : process.cwd();
            const exportsDirectory = join(outputDirectory, "exports");

            outputs.forEach((output) => {
                const workspaceFilePath = resolve(
                    exportsDirectory,
                    output.relativeFilePath
                );
                const workspaceDirectory = dirname(workspaceFilePath);
                if (!existsSync(workspaceDirectory)) {
                    mkdirSync(workspaceDirectory, { recursive: true });
                }
                writeFileSync(workspaceFilePath, output.outputContent);
            });

            spinner.succeed(
                chalk.green(
                    `Exported ${workspaces.length} workspaces to ${chalk.bold(exportsDirectory)}`
                )
            );

            console.log(chalk.blue(`\nExport details:`));
            outputs.forEach((output) => {
                console.log(`  ${chalk.gray("→")} ${output.relativeFilePath}`);
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
                .choices(["json", "dsl"] satisfies OutputFormat[])
                .default("json" satisfies OutputFormat)
        )
        .option("-p, --pretty", "Pretty-print output", false)
        .option("--meta", "Include metadata", true)
        .action(exportCommand);

    return cmd;
}
