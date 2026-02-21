import { createServer } from "vite";
import { WebSocketServer } from "ws";
import chokidar from "chokidar";
import { build } from "esbuild";
import path from "path";
import fs from "fs-extra";
import chalk from "chalk";
import { fileURLToPath } from "url";
import { builtinModules } from "module";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const packageRoot = path.resolve(__dirname, "../");

import { getEntryPoint } from "../utils/entry.js";

export const serveCommand = async () => {
    const cwd = process.cwd();
    let entryPoint: string;
    try {
        entryPoint = getEntryPoint(cwd);
    } catch (e: any) {
        console.error(chalk.red(e.message));
        process.exit(1);
    }

    console.log(chalk.blue("Starting development server..."));

    // State
    const clients = new Set<any>();
    let currentWorkspace: any = null;

    // Build workspace function
    const rebuildWorkspace = async () => {
        const tempEntry = path.join(process.cwd(), ".restruct-serve-entry.ts");
        let importPath = entryPoint.startsWith(".")
            ? entryPoint
            : `./${entryPoint}`;
        importPath = importPath.replace(/\\/g, "/");

        const entryContent = `
import "${importPath}";
import { workspaceRegistry } from "@structurizr/dsl";

const workspaces = workspaceRegistry.getWorkspaces();
export const workspaceSnapshot = workspaces.length > 0 
    ? (workspaces[0].toSnapshot ? workspaces[0].toSnapshot() : workspaces[0]) 
    : null;
`;
        fs.writeFileSync(tempEntry, entryContent);

        try {
            const bundleResult = await build({
                entryPoints: [tempEntry],
                bundle: true,
                write: false,
                platform: "browser",
                format: "iife",
                globalName: "serverBundle",
                external: [], // Bundle everything
            });

            const bundleCode = bundleResult.outputFiles[0]?.text ?? "";

            // Evaluate in a context
            // Using Function constructor
            const func = new Function(
                "window",
                bundleCode + "; return serverBundle;"
            );
            const exports = func({});

            if (exports && exports.workspaceSnapshot) {
                currentWorkspace = exports.workspaceSnapshot;

                // Send to clients
                const message = JSON.stringify({
                    type: "workspace",
                    workspace: currentWorkspace,
                });
                clients.forEach((client) => {
                    if (client.readyState === 1) {
                        client.send(message);
                    }
                });

                console.log(chalk.green("Workspace updated."));
            }
        } catch (err) {
            console.error(chalk.red("Failed to build workspace:"), err);
        } finally {
            if (fs.existsSync(tempEntry)) {
                fs.unlinkSync(tempEntry);
            }
        }
    };

    // Initial build
    await rebuildWorkspace();

    // Watcher
    chokidar
        .watch(cwd, { ignored: /node_modules|dist|\.git/ })
        .on("change", (path) => {
            if (path.endsWith(".ts")) {
                console.log(chalk.gray(`File changed: ${path}, rebuilding...`));
                rebuildWorkspace();
            }
        });

    // Vite server
    const server = await createServer({
        configFile: path.join(packageRoot, "preview-app", "vite.config.ts"),
        root: path.join(packageRoot, "preview-app"), // Serve the source directly!
        server: {
            port: 3000,
        },
        plugins: [
            {
                name: "restruct-websocket",
                configureServer(server) {
                    const wss = new WebSocketServer({ noServer: true });

                    server.httpServer?.on("upgrade", (req, socket, head) => {
                        if (req.url === "/_restruct_ws") {
                            console.log(
                                chalk.gray(
                                    "WebSocket upgrade request received for /_restruct_ws"
                                )
                            );
                            // Handle upgrade on specific path to avoid collision with Vite HMR
                            wss.handleUpgrade(req, socket, head, (ws) => {
                                console.log(
                                    chalk.gray(
                                        "WebSocket connection established"
                                    )
                                );
                                wss.emit("connection", ws, req);
                            });
                        }
                    });

                    wss.on("error", (err) => {
                        console.error(
                            chalk.red("WebSocket server error:"),
                            err
                        );
                    });

                    wss.on("connection", (ws) => {
                        clients.add(ws);
                        // Send current workspace immediately
                        if (currentWorkspace) {
                            ws.send(
                                JSON.stringify({
                                    type: "workspace",
                                    workspace: currentWorkspace,
                                })
                            );
                        }

                        ws.on("close", () => {
                            clients.delete(ws);
                        });
                    });
                },
            },
        ],
    });

    await server.listen();
    server.printUrls();
};
