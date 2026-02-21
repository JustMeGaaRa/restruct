import { IWorkspace, ViewType } from "@structurizr/dsl";
import { Viewport, ViewportProvider } from "@graph/svg";
import {
    ComponentDiagram,
    ContainerDiagram,
    SystemContextDiagram,
    SystemLandscapeDiagram,
    Workspace,
    WorkspaceProvider,
    ViewNavigationProvider,
    useViewNavigation,
    ModelDiagram,
    DeploymentDiagram,
    RestructDarkTheme,
    Themes,
    Styles,
} from "@structurizr/react";
import {
    ViewModeSwitcher,
    ViewMode,
    ZoomControls,
    Breadcrumbs,
} from "@restruct/ui";
import { useState, useEffect, useMemo, useRef } from "react";
import { bigBankPlc } from "./workspace";
import { ThemeProvider } from "../../../packages/structurizr-react/src/containers/ThemeProvider";

declare global {
    interface Window {
        __WS_PORT__?: number;
    }
}

const AppContent = ({
    workspace,
    setWorkspace,
}: {
    workspace: IWorkspace;
    setWorkspace: (ws: IWorkspace) => void;
}) => {
    const { currentView, setCurrentView } = useViewNavigation();
    const [viewMode, setViewMode] = useState<ViewMode>("diagrams");

    useEffect(() => {
        if (!currentView && workspace?.views.systemLandscape) {
            setCurrentView(workspace.views.systemLandscape);
        }
    }, [workspace, currentView, setCurrentView]);

    const breadcrumbs = useMemo(() => {
        return [
            { label: "System Landscape", onClick: () => {} },
            { label: "Big Bank plc", onClick: () => {} },
            { label: "Internet Banking System", onClick: () => {} },
            { label: "API Application", onClick: () => {} },
        ];
    }, []);

    function handleViewModeChange(view: ViewMode): void {
        setViewMode(view);
        if (view === "diagrams") {
            setCurrentView(
                workspace.views.systemLandscape ??
                    workspace.views.systemContexts[0] ??
                    workspace.views.containers[0] ??
                    workspace.views.components[0]
            );
        } else if (view === "model") {
            setCurrentView({ type: ViewType.Model, key: "model" });
        } else if (view === "deployment") {
            setCurrentView(workspace.views.deployments[0]);
        }
    }

    return (
        <div
            className={
                "flex items-center justify-center h-screen w-screen bg-neutral-950"
            }
        >
            <ViewModeSwitcher
                currentView={viewMode}
                onChange={handleViewModeChange}
            />
            {viewMode === "diagrams" && <Breadcrumbs items={breadcrumbs} />}

            <WorkspaceProvider
                workspace={workspace}
                setWorkspace={setWorkspace as any}
            >
                <Workspace>
                    {workspace.views.configuration?.themes && (
                        <Themes url={workspace.views.configuration.themes} />
                    )}
                    {workspace.views.configuration?.theme && (
                        <Themes url={workspace.views.configuration.theme} />
                    )}
                    {workspace.views.configuration?.styles && (
                        <Styles value={workspace.views.configuration.styles} />
                    )}
                    <ViewportProvider>
                        <Viewport>
                            {currentView?.key ===
                                workspace.views.systemLandscape?.key && (
                                <SystemLandscapeDiagram
                                    value={workspace.views.systemLandscape}
                                />
                            )}
                            {workspace.views.systemContexts
                                .filter((x) => x.key === currentView?.key)
                                .map((systemContext) => (
                                    <SystemContextDiagram
                                        key={systemContext.key}
                                        value={systemContext}
                                    />
                                ))}
                            {workspace.views.containers
                                .filter((x) => x.key === currentView?.key)
                                .map((container) => (
                                    <ContainerDiagram
                                        key={container.key}
                                        value={container}
                                    />
                                ))}
                            {workspace.views.components
                                .filter((x) => x.key === currentView?.key)
                                .map((component) => (
                                    <ComponentDiagram
                                        key={component.key}
                                        value={component}
                                    />
                                ))}
                            {workspace.views.deployments
                                .filter((x) => x.key === currentView?.key)
                                .map((deployment) => (
                                    <DeploymentDiagram
                                        key={deployment.key}
                                        value={deployment}
                                    />
                                ))}
                            {currentView?.type === ViewType.Model && (
                                <ModelDiagram value={currentView} />
                            )}
                        </Viewport>

                        <ZoomControls />
                    </ViewportProvider>
                </Workspace>
            </WorkspaceProvider>
        </div>
    );
};

export const App = () => {
    const [workspace, setWorkspace] = useState<IWorkspace | null>(null);
    const wsRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        if (!window.__WS_PORT__) {
            console.error("[App] Missing __WS_PORT__");
            return;
        }

        const timeoutId = setTimeout(() => {
            if (wsRef.current) return;

            const wsUrl = `ws://localhost:${window.__WS_PORT__}`;
            console.log("[App] Connecting to WebSocket:", wsUrl);

            const ws = new WebSocket(wsUrl);
            wsRef.current = ws;

            ws.onopen = () => {
                console.log("[App] WebSocket connected");
            };

            ws.onerror = (error) => {
                console.error("[App] WebSocket error:", error);
            };

            ws.onclose = (event) => {
                console.log(
                    "[App] WebSocket closed:",
                    event.code,
                    event.reason
                );
                if (wsRef.current === ws) {
                    wsRef.current = null;
                }
            };

            ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    if (data.type === "workspace") {
                        console.log("[App] Received workspace update");
                        setWorkspace(data.workspace);
                    } else if (data.command === "error") {
                        console.error("[App] Received error:", data.error);
                    }
                } catch (e) {
                    console.error("[App] Failed to parse message:", e);
                }
            };
        }, 100);

        return () => {
            clearTimeout(timeoutId);
            if (wsRef.current) {
                console.log("[App] Cleaning up WebSocket");
                wsRef.current.close();
                wsRef.current = null;
            }
        };
    }, []);

    if (!workspace) {
        return (
            <div className="flex items-center justify-center h-screen w-screen bg-neutral-900 text-white">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white mr-4"></div>
                <div>Loading workspace...</div>
            </div>
        );
    }

    return (
        <ViewNavigationProvider>
            <ThemeProvider theme={RestructDarkTheme}>
                <AppContent workspace={workspace} setWorkspace={setWorkspace} />
            </ThemeProvider>
        </ViewNavigationProvider>
    );
};
