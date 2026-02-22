import { IWorkspace } from "@structurizr/dsl";

type SubscriptionCallback = (workspaces: IWorkspace[]) => void;

export class WorkspaceChannel {
    private ws: WebSocket | null = null;
    private url: string;
    private subscribers: Set<SubscriptionCallback> = new Set();
    private isConnected: boolean = false;
    private reconnectTimeout: number | null = null;
    private shouldReconnect: boolean = true;

    constructor(url: string) {
        this.url = url;
    }

    public connect() {
        if (this.ws || !this.shouldReconnect) return;

        try {
            console.log(
                `[WorkspaceChannel] Connecting to WebSocket at: ${this.url}`
            );
            this.ws = new WebSocket(this.url);

            this.ws.onopen = () => {
                console.log("[WorkspaceChannel] WebSocket connected");
                this.isConnected = true;
                if (this.reconnectTimeout) {
                    clearTimeout(this.reconnectTimeout);
                    this.reconnectTimeout = null;
                }
            };

            this.ws.onerror = (error) => {
                console.error("[WorkspaceChannel] WebSocket error:", error);
            };

            this.ws.onclose = (event) => {
                console.log(
                    "[WorkspaceChannel] WebSocket closed:",
                    event.code,
                    event.reason
                );
                this.ws = null;
                this.isConnected = false;

                if (this.shouldReconnect) {
                    console.log(
                        "[WorkspaceChannel] Attempting to reconnect in 2s..."
                    );
                    this.reconnectTimeout = window.setTimeout(
                        () => this.connect(),
                        2000
                    );
                }
            };

            this.ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    if (data.type === "workspaces" && data.workspaces) {
                        this.notifySubscribers(data.workspaces);
                    } else if (data.type === "workspace" && data.workspace) {
                        // Fallback for older extension payloads if needed
                        this.notifySubscribers([data.workspace]);
                    } else if (data.command === "error") {
                        console.error(
                            "[WorkspaceChannel] Received error:",
                            data.error
                        );
                    }
                } catch (e) {
                    console.error(
                        "[WorkspaceChannel] Failed to parse message:",
                        e
                    );
                }
            };
        } catch (error) {
            console.error(
                "[WorkspaceChannel] Failed to create WebSocket:",
                error
            );
        }
    }

    public disconnect() {
        this.shouldReconnect = false;
        if (this.reconnectTimeout) {
            clearTimeout(this.reconnectTimeout);
            this.reconnectTimeout = null;
        }
        if (this.ws) {
            console.log("[WorkspaceChannel] Cleaning up WebSocket");
            this.ws.close();
            this.ws = null;
        }
        this.isConnected = false;
    }

    public subscribe(callback: SubscriptionCallback): () => void {
        this.subscribers.add(callback);
        return () => this.unsubscribe(callback);
    }

    public unsubscribe(callback: SubscriptionCallback) {
        this.subscribers.delete(callback);
    }

    private notifySubscribers(workspaces: IWorkspace[]) {
        this.subscribers.forEach((callback) => callback(workspaces));
    }
}
