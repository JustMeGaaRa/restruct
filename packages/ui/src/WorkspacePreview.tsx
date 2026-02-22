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
    Themes,
    Styles,
} from "@structurizr/react";
import { ZoomControls } from "./ZoomControls";
import { ViewModeSwitcher, ViewMode } from "./ViewModeSwitcher";
import { Flex } from "@chakra-ui/react";
import { useState, useEffect, ReactNode } from "react";

export interface WorkspacePreviewProps {
    workspace: IWorkspace;
    setWorkspace: (ws: IWorkspace) => void;
    diagramBreadcrumb?: ReactNode; // specific component from app like NavigationBreadcrumb
}

const WorkspacePreviewContent = ({
    workspace,
    setWorkspace,
    diagramBreadcrumb,
}: WorkspacePreviewProps) => {
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
        <Flex
            alignItems="center"
            justifyContent="center"
            h="100vh"
            w="100vw"
            position="relative"
            overflow="hidden"
            flexDirection="column"
        >
            <ViewModeSwitcher
                currentView={viewMode}
                onChange={handleViewModeChange}
            />

            {viewMode === "diagrams" && diagramBreadcrumb}

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
        </Flex>
    );
};

export const WorkspacePreview = (props: WorkspacePreviewProps) => {
    return (
        <ViewNavigationProvider>
            <WorkspacePreviewContent {...props} />
        </ViewNavigationProvider>
    );
};
