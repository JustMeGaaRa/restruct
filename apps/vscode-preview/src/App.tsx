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
import {
    ViewModeSwitcher,
    ViewMode,
    ZoomControls,
    Breadcrumbs,
} from "@restruct/ui";
import { bigBankPlc } from "./workspace";
import { useState, useEffect, useMemo } from "react";

const AppContent = () => {
    const [workspace, setWorkspace] = useState<IWorkspace>(bigBankPlc);
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
                setWorkspace={setWorkspace}
            >
                <Workspace>
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
    return (
        <ViewNavigationProvider>
            <AppContent />
        </ViewNavigationProvider>
    );
};
