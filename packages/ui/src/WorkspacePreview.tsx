import { IWorkspace, ViewType, Element } from "@structurizr/dsl";
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
import { Breadcrumbs, BreadcrumbItem } from "./Breadcrumbs";
import { Flex } from "@chakra-ui/react";
import { useState, useEffect, useMemo, ReactNode } from "react";

export interface WorkspacePreviewProps {
    workspace: IWorkspace;
    setWorkspace: (ws: IWorkspace) => void;
    diagramBreadcrumb?: ReactNode; // specific component from app like NavigationBreadcrumb
    // New optional props for workspace dropdown switcher in breadcrumbs
    availableWorkspaces?: { id?: string; name: string }[];
    onWorkspaceSelect?: (idOrName: string) => void;
}

const WorkspacePreviewContent = ({
    workspace,
    setWorkspace,
    diagramBreadcrumb,
    availableWorkspaces = [],
    onWorkspaceSelect,
}: WorkspacePreviewProps) => {
    const { currentView, setCurrentView } = useViewNavigation();
    type ViewMode = "diagrams" | "model" | "deployment";
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

    const breadcrumbItems = useMemo<BreadcrumbItem[]>(() => {
        const items: BreadcrumbItem[] = [];

        // 1. Workspace Dropdown
        const workspaceLabel = workspace?.name || "Workspace";
        const workspaceOptions =
            availableWorkspaces.length > 0
                ? availableWorkspaces.map((w) => ({
                      label: w.name,
                      value: w.id || w.name,
                  }))
                : [{ label: workspaceLabel, value: workspaceLabel }];

        items.push({
            label: workspaceLabel,
            options: workspaceOptions,
            onSelect: (val) => onWorkspaceSelect?.(val),
        });

        // 2. View Mode Dropdown
        const viewModeLabels: Record<ViewMode, string> = {
            diagrams: "Diagrams",
            model: "Model",
            deployment: "Deployment",
        };

        items.push({
            label: viewModeLabels[viewMode],
            options: [
                { label: "Diagrams", value: "diagrams" },
                { label: "Model", value: "model" },
                { label: "Deployment", value: "deployment" },
            ],
            onSelect: (val) => handleViewModeChange(val as ViewMode),
        });

        // 3. Drill-down based on view mode
        if (viewMode === "diagrams" && currentView) {
            // Include root System Landscape if we are in diagram mode
            items.push({
                label: "System Landscape",
                onClick: () => {
                    if (workspace?.views.systemLandscape) {
                        setCurrentView(workspace.views.systemLandscape as any);
                    }
                },
            });

            // Find elements to resolve hierarchy based on current view metadata
            // Structurizr views have keys or specific properties matching the element they describe
            const viewAny = currentView as any;

            if (currentView.type === ViewType.SystemContext) {
                const systemName = viewAny.softwareSystem || currentView.key;
                items.push({ label: systemName, onClick: () => {} });
            } else if (currentView.type === ViewType.Container) {
                const systemName = viewAny.softwareSystem || "System";
                const containerName = viewAny.container || currentView.key;
                items.push({
                    label: systemName,
                    onClick: () => {
                        // Navigate back to system context view of `systemName` if possible
                        const ctxView = workspace.views.systemContexts.find(
                            (v: any) => v.softwareSystem === systemName
                        );
                        if (ctxView) setCurrentView(ctxView as any);
                    },
                });
                items.push({ label: containerName, onClick: () => {} });
            } else if (currentView.type === ViewType.Component) {
                const containerName = viewAny.container || "Container";
                const componentName = viewAny.component || currentView.key;

                // Without extensive id matching traversing up model elements, we
                // display what we have via view metadata
                items.push({
                    label: containerName,
                    onClick: () => {
                        const cntView = workspace.views.containers.find(
                            (v: any) => v.container === containerName
                        );
                        if (cntView) setCurrentView(cntView as any);
                    },
                });
                items.push({ label: componentName, onClick: () => {} });
            }
        } else if (viewMode === "deployment" && currentView) {
            const envName = (currentView as any).environment || currentView.key;
            items.push({ label: envName, onClick: () => {} });
        } else if (viewMode === "model") {
            // Already adequately covered by the View Mode Dropdown saying "Model"
        }

        return items;
    }, [
        workspace,
        availableWorkspaces,
        currentView,
        viewMode,
        onWorkspaceSelect,
        setCurrentView,
    ]);

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
            {diagramBreadcrumb ? (
                viewMode === "diagrams" && diagramBreadcrumb
            ) : (
                <Breadcrumbs items={breadcrumbItems} />
            )}

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
