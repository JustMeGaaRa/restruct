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
} from "@structurizr/react";
import { ZoomControls, ViewModeSwitcher, ViewMode } from "@restruct/ui";
import { NavigationBreadcrumb } from "./components/NavigationBreadcrumb";
import { useState, useEffect, useRef } from "react";
import { Box, Flex, Spinner, Text } from "@chakra-ui/react";

// Injected by the build process or loaded via WebSocket
declare global {
    interface Window {
        __WORKSPACE__: IWorkspace;
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
            setCurrentView(workspace.views.systemLandscape as any);
        }
    }, [workspace, currentView, setCurrentView]);

    function handleViewModeChange(view: ViewMode): void {
        setViewMode(view);
        if (view === "diagrams") {
            setCurrentView(
                (workspace.views.systemLandscape ??
                    workspace.views.systemContexts[0] ??
                    workspace.views.containers[0] ??
                    workspace.views.components[0]) as any
            );
        } else if (view === "model") {
            setCurrentView({ type: ViewType.Model, key: "model" } as any);
        } else if (view === "deployment") {
            setCurrentView(workspace.views.deployments[0] as any);
        }
    }

    return (
        <Box
            h="100vh"
            w="100vw"
            bg="gray.950"
            display="flex"
            alignItems="center"
            justifyContent="center"
            position="relative"
            overflow="hidden"
        >
            <ViewModeSwitcher
                currentView={viewMode}
                onChange={handleViewModeChange}
            />
            {viewMode === "diagrams" && <NavigationBreadcrumb />}

            <WorkspaceProvider
                workspace={workspace}
                setWorkspace={setWorkspace as any}
            >
                <Workspace>
                    <ViewportProvider>
                        <Viewport>
                            {currentView?.key ===
                                workspace.views.systemLandscape?.key && (
                                <SystemLandscapeDiagram
                                    value={
                                        workspace.views.systemLandscape as any
                                    }
                                />
                            )}
                            {workspace.views.systemContexts
                                .filter((x: any) => x.key === currentView?.key)
                                .map((systemContext: any) => (
                                    <SystemContextDiagram
                                        key={systemContext.key}
                                        value={systemContext}
                                    />
                                ))}
                            {workspace.views.containers
                                .filter((x: any) => x.key === currentView?.key)
                                .map((container: any) => (
                                    <ContainerDiagram
                                        key={container.key}
                                        value={container}
                                    />
                                ))}
                            {workspace.views.components
                                .filter((x: any) => x.key === currentView?.key)
                                .map((component: any) => (
                                    <ComponentDiagram
                                        key={component.key}
                                        value={component}
                                    />
                                ))}
                            {workspace.views.deployments
                                .filter((x: any) => x.key === currentView?.key)
                                .map((deployment: any) => (
                                    <DeploymentDiagram
                                        key={deployment.key}
                                        value={deployment}
                                    />
                                ))}
                            {currentView?.type === ViewType.Model && (
                                <ModelDiagram value={currentView as any} />
                            )}
                        </Viewport>

                        <ZoomControls />
                    </ViewportProvider>
                </Workspace>
            </WorkspaceProvider>
        </Box>
    );
};

export const App = () => {
    const [workspace, setWorkspace] = useState<IWorkspace | null>(
        window.__WORKSPACE__ || null
    );

    const wsRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (wsRef.current) return;

            const protocol =
                window.location.protocol === "https:" ? "wss:" : "ws:";
            const wsUrl = `${protocol}//${window.location.host}/_restruct_ws`;
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
                const data = JSON.parse(event.data);
                if (data.type === "workspace") {
                    console.log("[App] Received workspace update");
                    setWorkspace(data.workspace);
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
            <Flex
                h="100vh"
                w="100vw"
                align="center"
                justify="center"
                bg="gray.900"
                color="white"
            >
                <Spinner size="xl" />
                <Text ml={4}>Loading workspace...</Text>
            </Flex>
        );
    }

    return (
        <ViewNavigationProvider>
            <AppContent workspace={workspace} setWorkspace={setWorkspace} />
        </ViewNavigationProvider>
    );
};
