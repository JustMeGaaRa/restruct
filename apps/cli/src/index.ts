#!/usr/bin/env node
import { Command } from "commander";
import { createInitCommand } from "./commands/init.js";
import { createBuildCommand } from "./commands/build.js";
import { createServeCommand } from "./commands/serve.js";
import { createExportCommand } from "./commands/export.js";

const program = new Command();

program
    .name("restruct")
    .description(
        "re:struct cli - tool to create and manage architecture as a code projects"
    )
    .version("0.1.0-alpha.0");

program.addCommand(createInitCommand());
program.addCommand(createBuildCommand());
program.addCommand(createServeCommand());
program.addCommand(createExportCommand());

program.parse();
