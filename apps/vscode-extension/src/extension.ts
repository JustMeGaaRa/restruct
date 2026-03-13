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

    outputChannel?.appendLine(`[Script] Running for workspace of: ${filePath}`);

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

    // Find all .ts files in the workspace (excluding typical build/module folders)
    const tsFilesUri = await vscode.workspace.findFiles(
        new vscode.RelativePattern(workspaceFolder, "**/*.ts"),
        new vscode.RelativePattern(
            workspaceFolder,
            "{node_modules,dist,out,build,.git}/**"
        ) // Exclude overrides
    );

    const tsFiles = tsFilesUri.map((uri) => uri.fsPath);

    // Collect dirty (unsaved) file contents to inject via hook
    const dirtyFiles: Record<string, string> = {};
    vscode.workspace.textDocuments.forEach((doc) => {
        if (doc.isDirty && doc.fileName.endsWith(".ts")) {
            dirtyFiles[path.resolve(doc.fileName)] = doc.getText();
        }
    });

    // Also include the currently active document content if open, even if not dirty
    const activeDoc = vscode.workspace.textDocuments.find(
        (d) => d.fileName === filePath
    );
    if (activeDoc) {
        dirtyFiles[path.resolve(activeDoc.fileName)] = activeDoc.getText();
    }

    const tempFilePath = path.join(dir, ".restruct_preview_runner.js");
    outputChannel?.appendLine(`[Script] Temp file: ${tempFilePath}`);

    // Resolve typescript from the extension's dependencies
    let typescriptPath: string;
    try {
        typescriptPath = require.resolve("typescript");
    } catch (e) {
        outputChannel?.appendLine("Could not find typescript");
        updateWebviewError(
            "Could not find typescript. Please ensure it is installed in the extension."
        );
        return;
    }

    // Creating the runner script
    const wrapperScript = `
        const fs = require('fs');
        const path = require('path');
        
        const dirtyFiles = ${JSON.stringify(dirtyFiles)};
        const dirtyFilesMap = {};
        for (const [key, value] of Object.entries(dirtyFiles)) {
            dirtyFilesMap[path.resolve(key)] = value;
        }

        const originalReadFileSync = fs.readFileSync;
        fs.readFileSync = function(pathArg, options) {
            const resolvedPath = path.resolve(pathArg);
            if (dirtyFilesMap[resolvedPath] !== undefined) {
                const content = dirtyFilesMap[resolvedPath];
                if (options === 'utf8' || (options && options.encoding === 'utf8')) {
                    return content;
                } else if (!options || typeof options === 'object') {
                    return Buffer.from(content, 'utf8');
                }
            }
            return originalReadFileSync.apply(this, arguments);
        };

        const ts = require('${typescriptPath.replace(/\\/g, "\\\\")}');
        require.extensions['.ts'] = function(module, filename) {
            const content = fs.readFileSync(filename, 'utf8');
            const result = ts.transpileModule(content, {
                fileName: filename,
                compilerOptions: {
                    module: ts.ModuleKind.CommonJS,
                    moduleResolution: ts.ModuleResolutionKind.NodeJs,
                    esModuleInterop: true,
                    allowSyntheticDefaultImports: true,
                    target: ts.ScriptTarget.ES2022
                }
            });
            module._compile(result.outputText, filename);
        };

        const tsFiles = ${JSON.stringify(tsFiles)};
        for (const file of tsFiles) {
            try {
                require(file);
            } catch(e) {
                console.error('Failed to require file:', file, '\\n', e);
            }
        }

        try {
            const { workspaceRegistry } = require('@restruct/structurizr-dsl');
            const workspaces = workspaceRegistry.getWorkspaces();
            const workspaceSnapshots = workspaces.map((ws) => ws.toSnapshot ? ws.toSnapshot() : ws);
            console.log('<START_OUTPUT>');
            console.log(JSON.stringify(workspaceSnapshots));
            console.log('<END_OUTPUT>');
        } catch (e) {
            console.error('Failed to get workspace snapshots:', e);
        }
    `;

    try {
        fs.writeFileSync(tempFilePath, wrapperScript);
    } catch (e) {
        outputChannel?.appendLine(`Failed to write temp file: ${e}`);
        return;
    }

    const child = cp.spawn("node", [tempFilePath], {
        cwd: dir,
        env: { ...process.env, TS_NODE_TRANSPILE_ONLY: "true" }, // Pass environment variables
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
                if (data && Array.isArray(data)) {
                    outputChannel?.appendLine(
                        `[Script] Parsed ${data.length} workspace(s) successfully`
                    );
                    currentWorkspaces = data;
                    broadcastWorkspaces(currentWorkspaces);
                } else {
                    outputChannel?.appendLine(
                        "[Script] JSON parsed but result is not an array"
                    );
                    updateWebviewError(
                        "Workspace snapshot not found. Make sure you use @restruct/structurizr-dsl."
                    );
                }
            } catch (e) {
                outputChannel?.appendLine(
                    `[Script] Failed to parse JSON: ${e}`
                );
                updateWebviewError("Failed to parse JSON output.");
            }
        } else {
            // If we didn't find markers, maybe there was no output or it failed silently before printing markers
            outputChannel?.appendLine(
                `[Script] Output markers not found. stdout snippet: ${output.slice(0, 200)}`
            );
            if (errorOutput) {
                updateWebviewError(errorOutput);
            } else {
                updateWebviewError("No output received from script.");
            }
        }
    });
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
