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
import { bigBankPlc } from "./workspace";
import { useState, useEffect, useMemo } from "react";
import { ThemeProvider } from "../../../packages/structurizr-react/src/containers/ThemeProvider";

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
    return (
        <ViewNavigationProvider>
            <ThemeProvider theme={RestructDarkTheme}>
                <AppContent />
            </ThemeProvider>
        </ViewNavigationProvider>
    );
};
