import inquirer from "inquirer";
import fs from "fs-extra";
import path from "path";
import chalk from "chalk";
import ora from "ora";
import { Command } from "commander";

export const initCommand = async (name?: string) => {
    let projectName = name;
    if (!projectName) {
        const answers = await inquirer.prompt([
            {
                type: "input",
                name: "projectName",
                message: "What is the name of your project?",
                default: "my-structurizr-project",
            },
        ]);
        projectName = answers.projectName;
    }

    if (!projectName) {
        console.error("Project name is required");
        process.exit(1);
    }

    const projectPath = path.join(process.cwd(), projectName);

    if (fs.existsSync(projectPath)) {
        console.error(chalk.red(`Directory ${projectName} already exists.`));
        process.exit(1);
    }

    const spinner = ora(`Creating project in ${projectPath}...`).start();

    try {
        fs.ensureDirSync(projectPath);

        // Create package.json
        const packageJson = {
            name: projectName,
            version: "0.1.0",
            private: true,
            scripts: {
                build: "restruct build",
                serve: "restruct serve",
            },
            dependencies: {
                "@restruct/structurizr-dsl": "*",
                typescript: "^5.0.0",
            },
        };

        fs.writeJsonSync(path.join(projectPath, "package.json"), packageJson, {
            spaces: 4,
        });

        // ... (lines 53-108 omitted as they don't use answers)

        // Create tsconfig.json
        const tsConfig = {
            compilerOptions: {
                target: "ES2022",
                module: "ESNext",
                moduleDetection: "force",
                moduleResolution: "bundler",
                strict: true,
                esModuleInterop: true,
                skipLibCheck: true,
                forceConsistentCasingInFileNames: true,
            },
            include: ["workspaces/**/*"],
        };

        fs.writeJsonSync(path.join(projectPath, "tsconfig.json"), tsConfig, {
            spaces: 4,
        });

        // Create workspaces/index.ts
        const workspacesDir = path.join(projectPath, "workspaces");
        fs.ensureDirSync(workspacesDir);

        const workspaceContent = `import { workspace } from "@restruct/structurizr-dsl";

workspace("Untitled Workspace", "", (_) => {
    _.description("A default architecture.");
});
`;

        fs.writeFileSync(
            path.join(workspacesDir, "index.ts"),
            workspaceContent
        );

        // Create .gitignore
        const gitignoreContent = `node_modules
dist
.DS_Store
`;
        fs.writeFileSync(
            path.join(projectPath, ".gitignore"),
            gitignoreContent
        );

        // Create README.md
        const readmeContent = `# ${projectName}

Architecture documentation using [re:struct](https://github.com/JustMeGaaRa/restruct).

## Getting Started

1.  **Install dependencies:**
    \`\`\`bash
    npm install
    \`\`\`

2.  **Start development server:**
    \`\`\`bash
    npm run serve
    \`\`\`

3.  **Build static site:**
    \`\`\`bash
    npm run build
    \`\`\`

## Project Structure

-   \`workspaces/\`: Entry point for your architecture definitions.
-   \`dist/\`: Generated static site.
-   \`exports/\`: Exported workspace files (JSON, DSL, SVG).
`;
        fs.writeFileSync(path.join(projectPath, "README.md"), readmeContent);

        spinner.succeed(
            chalk.green(`Project ${projectName} created successfully!`)
        );
        console.log(chalk.blue(`\nNext steps:`));
        console.log(`  cd ${projectName}`);
        console.log(`  npm install`);
        console.log(`  npm run serve\n`);
    } catch (error: unknown) {
        spinner.fail(chalk.red("Failed to create project."));
        console.error(error instanceof Error ? error.message : String(error));
    }
};

export function createInitCommand(): Command {
    const cmd = new Command("init");

    cmd.description("Initialize a new Restruct project")
        .argument("[name]", "Project name")
        .action(initCommand);

    return cmd;
}
