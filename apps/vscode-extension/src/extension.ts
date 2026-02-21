import * as vscode from "vscode";
import * as cp from "child_process";
import * as path from "path";
import * as fs from "fs";
import { WebSocketServer, WebSocket } from "ws";

let currentPanel: vscode.WebviewPanel | undefined = undefined;
let outputChannel: vscode.OutputChannel | undefined = undefined;
let activeListener: vscode.Disposable | undefined = undefined;
let wss: WebSocketServer | undefined = undefined;
let wsClients: Set<WebSocket> = new Set();
let wsPort: number | undefined = undefined;
let currentWorkspace: any = null;

export function activate(context: vscode.ExtensionContext) {
    outputChannel = vscode.window.createOutputChannel("Restruct Preview");
    context.subscriptions.push(outputChannel);

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
        outputChannel?.appendLine("Webview connected to WebSocket Server");
        wsClients.add(ws);

        if (currentWorkspace) {
            ws.send(
                JSON.stringify({
                    type: "workspace",
                    workspace: currentWorkspace,
                })
            );
        }

        ws.on("close", () => {
            wsClients.delete(ws);
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
        currentPanel.reveal(vscode.ViewColumn.Beside);
    } else {
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
                currentPanel = undefined;
                if (activeListener) {
                    activeListener.dispose();
                    activeListener = undefined;
                }
                currentWorkspace = null;
                // Optionally clear wsClients here by closing them
                wsClients.forEach((ws) => ws.terminate());
                wsClients.clear();
            },
            null,
            context.subscriptions
        );
    }

    // Setup watcher
    // We want live updates, so we listen to document changes
    const changeListener = vscode.workspace.onDidChangeTextDocument((e) => {
        if (e.document.fileName === filePath) {
            debouncedRun();
        }
    });

    if (activeListener) {
        activeListener.dispose();
    }
    activeListener = changeListener;

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
        currentPanel.webview.html = getWebviewContent(
            currentPanel.webview,
            context.extensionUri,
            wsPort!
        );
    }

    runScript(filePath);
}

async function runScript(filePath: string) {
    if (!currentPanel) {
        return;
    }

    outputChannel?.appendLine(`Running ${filePath}...`);

    // Get the content to run: prefer dirty content from open document
    const document = vscode.workspace.textDocuments.find(
        (d) => d.fileName === filePath
    );
    const codeContent = document
        ? document.getText()
        : fs.readFileSync(filePath, "utf-8");

    // Create a temporary file in the same directory to allow relative imports to work
    const dir = path.dirname(filePath);
    const ext = path.extname(filePath);
    const base = path.basename(filePath, ext);
    const tempFilePath = path.join(dir, `.${base}.preview${ext}`);

    try {
        fs.writeFileSync(tempFilePath, codeContent);
    } catch (e) {
        outputChannel?.appendLine(`Failed to write temp file: ${e}`);
        return;
    }

    // Resolve ts-node/register from the extension's dependencies
    let tsNodeRegister: string;
    try {
        tsNodeRegister = require.resolve("ts-node/register");
    } catch (e) {
        outputChannel?.appendLine("Could not find ts-node/register");
        updateWebviewError(
            "Could not find ts-node. Please ensure it is installed in the extension."
        );
        try {
            fs.unlinkSync(tempFilePath);
        } catch {}
        return;
    }

    // wrapper script to run the user's file
    // We run the TEMP file, then extract the structurizr workspace snapshot
    const wrapperScript = `
        require('${tsNodeRegister.replace(/\\/g, "\\\\")}');
        try {
            require('${tempFilePath.replace(/\\/g, "\\\\")}');
            const { workspaceRegistry } = require('@structurizr/dsl');
            const workspaces = workspaceRegistry.getWorkspaces();
            const workspaceSnapshot = workspaces.length > 0 
                ? (workspaces[0].toSnapshot ? workspaces[0].toSnapshot() : workspaces[0]) 
                : null;
            console.log('<START_OUTPUT>');
            console.log(JSON.stringify(workspaceSnapshot));
            console.log('<END_OUTPUT>');
        } catch (e) {
            console.error(e);
        }
    `;

    const child = cp.spawn("node", ["-e", wrapperScript], {
        cwd: dir,
        env: { ...process.env }, // Pass environment variables
    });

    let output = "";
    let errorOutput = "";

    child.stdout.on("data", (data) => {
        output += data.toString();
    });

    child.stderr.on("data", (data) => {
        errorOutput += data.toString();
        outputChannel?.append(data.toString());
    });

    child.on("close", (code) => {
        // Cleanup temp file
        try {
            if (fs.existsSync(tempFilePath)) {
                fs.unlinkSync(tempFilePath);
            }
        } catch (e) {
            console.error("Failed to delete temp file", e);
        }

        if (code !== 0) {
            outputChannel?.appendLine(`Process exited with code ${code}`);
            updateWebviewError(
                errorOutput || `Process exited with code ${code}`
            );
            return;
        }

        // Parse output
        const startMarker = "<START_OUTPUT>";
        const endMarker = "<END_OUTPUT>";
        const startIndex = output.indexOf(startMarker);
        const endIndex = output.indexOf(endMarker);

        if (startIndex !== -1 && endIndex !== -1) {
            const jsonString = output
                .substring(startIndex + startMarker.length, endIndex)
                .trim();
            try {
                const data = JSON.parse(jsonString);
                if (data) {
                    currentWorkspace = data;
                    broadcastWorkspace(currentWorkspace);
                } else {
                    updateWebviewError(
                        "Workspace snapshot not found. Make sure you use @structurizr/dsl."
                    );
                }
            } catch (e) {
                updateWebviewError("Failed to parse JSON output.");
            }
        } else {
            // If we didn't find markers, maybe there was no output or it failed silently before printing markers
            if (errorOutput) {
                updateWebviewError(errorOutput);
            } else {
                updateWebviewError("No output received from script.");
            }
        }
    });
}

function broadcastWorkspace(workspace: any) {
    const message = JSON.stringify({ type: "workspace", workspace });
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
<html lang="en">
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
