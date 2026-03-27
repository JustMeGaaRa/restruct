import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import { WebSocketServer, WebSocket } from "ws";
import { build } from "esbuild";

let currentPanel: vscode.WebviewPanel | undefined = undefined;
let outputChannel: vscode.OutputChannel | undefined = undefined;
let activeListener: vscode.Disposable | undefined = undefined;
let wss: WebSocketServer | undefined = undefined;
let wsClients: Set<WebSocket> = new Set();
let wsPort: number | undefined = undefined;
let currentWorkspaces: any[] | null = null;

export function activate(context: vscode.ExtensionContext) {
    outputChannel = vscode.window.createOutputChannel("Restruct Preview");
    context.subscriptions.push(outputChannel);
    outputChannel.appendLine("[Extension] Activating...");

    // Initialize the WebSocket Server on port 0 (assigns a random available port)
    wss = new WebSocketServer({ port: 0 });

    wss.on("listening", () => {
        const address = wss?.address();
        if (address && typeof address === "object") {
            wsPort = address.port;
            outputChannel?.appendLine(
                `WebSocket Server started on port ${wsPort}`
            );

            // If the panel is already open and waiting for the port (rare edge case),
            // you might need to reload it. Handled primarily at panel creation.
        }
    });

    wss.on("connection", (ws) => {
        wsClients.add(ws);
        outputChannel?.appendLine(
            `[WS] Client connected (total: ${wsClients.size})`
        );

        if (currentWorkspaces) {
            outputChannel?.appendLine(
                `[WS] Sending cached ${currentWorkspaces.length} workspace(s) to new client`
            );
            ws.send(
                JSON.stringify({
                    type: "workspaces",
                    workspaces: currentWorkspaces,
                })
            );
        } else {
            outputChannel?.appendLine(
                "[WS] No cached workspaces to send to new client"
            );
        }

        ws.on("close", () => {
            wsClients.delete(ws);
            outputChannel?.appendLine(
                `[WS] Client disconnected (remaining: ${wsClients.size})`
            );
        });

        ws.on("error", (err) => {
            outputChannel?.appendLine(
                `WebSocket instance error: ${err.message}`
            );
        });
    });

    wss.on("error", (err) => {
        outputChannel?.appendLine(`WebSocket Server error: ${err.message}`);
    });

    context.subscriptions.push(
        vscode.commands.registerCommand("restruct.preview", () => {
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                vscode.window.showErrorMessage(
                    "Open a TypeScript file to preview."
                );
                return;
            }

            const filePath = editor.document.fileName;
            outputChannel?.appendLine(
                `[Command] Invoking preview for: ${filePath}`
            );

            if (!filePath.endsWith(".ts")) {
                vscode.window.showErrorMessage(
                    "Restruct Preview only works with TypeScript files."
                );
                return;
            }

            // Ensure the WebSocket server has a port before opening the preview
            if (!wsPort) {
                vscode.window.showErrorMessage(
                    "WebSocket server is still initializing. Please try again in a moment."
                );
                return;
            }

            startPreview(context, filePath);
        })
    );
}

function startPreview(context: vscode.ExtensionContext, filePath: string) {
    if (currentPanel) {
        outputChannel?.appendLine("[Preview] Revealing existing panel");
        currentPanel.reveal(vscode.ViewColumn.Beside);
    } else {
        outputChannel?.appendLine(
            `[Preview] Creating new panel for: ${filePath}`
        );
        currentPanel = vscode.window.createWebviewPanel(
            "restructPreview",
            "Preview: " + path.basename(filePath),
            vscode.ViewColumn.Beside,
            {
                enableScripts: true,
                localResourceRoots: [
                    vscode.Uri.joinPath(context.extensionUri, "media"),
                ],
            }
        );

        currentPanel.onDidDispose(
            () => {
                outputChannel?.appendLine(
                    "[Panel] Webview disposed — cleaning up"
                );
                currentPanel = undefined;
                if (activeListener) {
                    activeListener.dispose();
                    activeListener = undefined;
                    outputChannel?.appendLine("[Panel] File watcher disposed");
                }
                currentWorkspaces = null;
                // Optionally clear wsClients here by closing them
                const clientCount = wsClients.size;
                wsClients.forEach((ws) => ws.terminate());
                wsClients.clear();
                outputChannel?.appendLine(
                    `[Panel] Terminated ${clientCount} WebSocket client(s)`
                );
            },
            null,
            context.subscriptions
        );
    }

    // Setup watcher
    // We want live updates, so we listen to document changes
    const changeListener = vscode.workspace.onDidChangeTextDocument((e) => {
        if (e.document.fileName.endsWith(".ts")) {
            debouncedRun();
        }
    });

    if (activeListener) {
        outputChannel?.appendLine("[Preview] Disposing previous file watcher");
        activeListener.dispose();
    }
    activeListener = changeListener;
    outputChannel?.appendLine(
        `[Preview] Setting up file watcher for: ${filePath}`
    );

    let debounceTimer: NodeJS.Timeout | undefined;
    const debouncedRun = () => {
        if (debounceTimer) {
            clearTimeout(debounceTimer);
        }
        debounceTimer = setTimeout(() => {
            runScript(filePath);
        }, 500);
    };

    // Initial run
    if (!currentPanel.webview.html) {
        outputChannel?.appendLine("[Preview] Setting webview HTML content");
        currentPanel.webview.html = getWebviewContent(
            currentPanel.webview,
            context.extensionUri,
            wsPort!
        );
    }

    outputChannel?.appendLine("[Preview] Triggering initial script run");
    runScript(filePath);
}

async function runScript(filePath: string) {
    if (!currentPanel) {
        return;
    }

    outputChannel?.appendLine(`[Script] Running for workspace: ${filePath}`);

    const workspaceFolder = vscode.workspace.getWorkspaceFolder(
        vscode.Uri.file(filePath)
    );
    if (!workspaceFolder) {
        vscode.window.showErrorMessage(
            "The file is not part of a VS Code workspace."
        );
        return;
    }

    const dir = workspaceFolder.uri.fsPath;

    // Collect dirty (unsaved) file contents to inject via esbuild plugin
    const dirtyFiles = new Map<string, string>();
    vscode.workspace.textDocuments.forEach((doc) => {
        if (doc.isDirty && doc.fileName.endsWith(".ts")) {
            dirtyFiles.set(path.resolve(doc.fileName), doc.getText());
        }
    });

    // Also include the currently active document content if open, even if not dirty
    const activeDoc = vscode.workspace.textDocuments.find(
        (d) => d.fileName === filePath
    );
    if (activeDoc) {
        dirtyFiles.set(path.resolve(activeDoc.fileName), activeDoc.getText());
    }

    const importPath = filePath.replace(/\\/g, "/");
    const entryContent = `
import "${importPath}";
import { workspaceRegistry } from "@restruct/structurizr-dsl";

const workspaces = workspaceRegistry.getWorkspaces();
export const workspaceSnapshots = workspaces.map(ws => ws.toSnapshot ? ws.toSnapshot() : ws);
`;

    try {
        const bundleResult = await build({
            stdin: {
                contents: entryContent,
                resolveDir: dir,
                loader: "ts",
            },
            bundle: true,
            write: false,
            platform: "node",
            format: "iife",
            globalName: "serverBundle",
            external: ["vscode"],
            minify: false,
            plugins: [
                {
                    name: "restruct-dirty",
                    setup(build) {
                        build.onLoad({ filter: /\.ts$/ }, async (args) => {
                            const content = dirtyFiles.get(
                                path.resolve(args.path)
                            );
                            if (content !== undefined) {
                                return { contents: content, loader: "ts" };
                            }
                            return null; // Fallback to fs
                        });
                    },
                },
            ],
        });

        const bundleCode = bundleResult.outputFiles[0]?.text ?? "";

        // Evaluate in a context
        const func = new Function(
            "window",
            bundleCode + "; return serverBundle;"
        );
        const exports = func({});

        if (exports && exports.workspaceSnapshots) {
            currentWorkspaces = exports.workspaceSnapshots;
            outputChannel?.appendLine(
                `[Script] Generated ${exports.workspaceSnapshots.length} workspace(s) successfully`
            );
            broadcastWorkspaces(exports.workspaceSnapshots);
        } else {
            outputChannel?.appendLine(
                "[Script] No workspaceSnapshots found in bundle exports"
            );
            updateWebviewError(
                "Workspace snapshot not found. Make sure you use @restruct/structurizr-dsl."
            );
        }
    } catch (err: any) {
        console.error("Bundle failed", err);
        outputChannel?.appendLine(`[Script] Bundle error: ${err.message}`);
        updateWebviewError(err.message || String(err));
    }
}

function broadcastWorkspaces(workspaces: any[]) {
    const message = JSON.stringify({ type: "workspaces", workspaces });
    wsClients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
}

function updateWebviewError(error: string) {
    if (!currentPanel) {
        return;
    }
    outputChannel?.appendLine(
        `[Webview] Sending error to webview: ${error.slice(0, 300)}`
    );
    // We can still use postMessage for extension-level errors
    currentPanel.webview.postMessage({ command: "error", error: error });
}

function getWebviewContent(
    webview: vscode.Webview,
    extensionUri: vscode.Uri,
    port: number
) {
    // Local path to main script run in the webview
    const scriptPathOnDisk = vscode.Uri.joinPath(
        extensionUri,
        "media",
        "assets",
        "index.js"
    );
    const stylePathOnDisk = vscode.Uri.joinPath(
        extensionUri,
        "media",
        "assets",
        "index.css"
    );

    // And the uri we use to load this script in the webview
    const scriptUri = webview.asWebviewUri(scriptPathOnDisk);
    const styleUri = webview.asWebviewUri(stylePathOnDisk);

    // Use a nonce to whitelist which scripts can be run
    const nonce = getNonce();

    return `<!DOCTYPE html>
<html lang="en" class="dark" style="color-scheme: dark">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; font-src ${webview.cspSource}; style-src ${webview.cspSource} 'unsafe-inline'; img-src ${webview.cspSource} data:; script-src 'nonce-${nonce}'; connect-src ws://localhost:${port};">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Restruct Preview</title>
    <link rel="stylesheet" type="text/css" href="${styleUri}">
    <script nonce="${nonce}">
        window.__WS_PORT__ = ${port};
    </script>
</head>
<body>
    <div id="root"></div>
    <script nonce="${nonce}" src="${scriptUri}"></script>
</body>
</html>`;
}

function getNonce() {
    let text = "";
    const possible =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

export function deactivate() {
    if (activeListener) {
        activeListener.dispose();
    }
    if (wss) {
        wss.close();
    }
}
