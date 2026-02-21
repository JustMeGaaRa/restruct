import inquirer from "inquirer";
import fs from "fs-extra";
import path from "path";
import chalk from "chalk";
import ora from "ora";

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
                "@structurizr/dsl": "*",
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
                module: "NodeNext",
                moduleResolution: "NodeNext",
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

        // Create workspace.ts
        const workspaceContent = `import { workspace } from "@structurizr/dsl";

workspace("Untitled Workspace", "", (_) => {
    _.description("A default architecture.");
});
`;

        fs.writeFileSync(
            path.join(projectPath, "workspaces/index.ts"),
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

        spinner.succeed(
            chalk.green(`Project ${projectName} created successfully!`)
        );
        console.log(chalk.blue(`\nNext steps:`));
        console.log(`  cd ${projectName}`);
        console.log(`  pnpm install`);
        console.log(`  restruct serve\n`);
    } catch (error) {
        spinner.fail(chalk.red("Failed to create project."));
        console.error(error);
    }
};
