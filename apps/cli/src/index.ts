#!/usr/bin/env node
import { Command } from "commander";
import chalk from "chalk";
import { initCommand } from "./commands/init.js";

const program = new Command();

program
    .name("restruct")
    .description("CLI for Restruct - Diagram as Code")
    .version("0.0.1");

program
    .command("init [name]")
    .description("Initialize a new Restruct project")
    .action(initCommand);

import { buildCommand } from "./commands/build.js";

// ... (init command registration)

program
    .command("build")
    .description("Build the static site")
    .action(buildCommand);

import { serveCommand } from "./commands/serve.js";

// ...

program
    .command("serve")
    .description("Serve the project with live updates")
    .action(serveCommand);

program.parse();
