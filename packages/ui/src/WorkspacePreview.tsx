import {
    findAnyExisting,
    findViewByType,
    IContainerView,
    IDeploymentView,
    ISystemContextView,
    IWorkspace,
    ViewType,
} from "@restruct/structurizr-dsl";
import { Viewport, ViewportProvider } from "@restruct/react-svg";
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
    useWorkspace,
} from "@restruct/structurizr-react";
import { ZoomControls } from "./ZoomControls";
import { Breadcrumbs, BreadcrumbItem } from "./Breadcrumbs";
import { LayerIcon } from "./LayerIcon";
import {
    LuWorkflow,
    LuUser,
    LuContainer,
    LuZoomIn,
    LuZoomOut,
} from "react-icons/lu";
import { ButtonGroup, Flex, IconButton } from "@chakra-ui/react";
import { useState, useEffect, useMemo } from "react";

export interface WorkspacePreviewProps {
    workspace: IWorkspace;
    setWorkspace: (ws: IWorkspace) => void;
    availableWorkspaces?: { id?: string; name: string }[];
    onWorkspaceSelect?: (idOrName: string) => void;
}

type ViewMode = "diagrams" | "model" | "deployment";

const WorkspacePreviewContent = ({
    workspace,
    availableWorkspaces = [],
    onWorkspaceSelect,
}: WorkspacePreviewProps) => {
    const { getSoftwareSystemById, getContainerById, getElementParentId } =
        useWorkspace();
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
            setCurrentView(findAnyExisting(workspace)!);
        } else if (view === "model") {
            setCurrentView({ type: ViewType.Model, key: "model" } as any);
        } else if (view === "deployment") {
            setCurrentView(findViewByType(workspace, ViewType.Deployment)!);
        }
    }

    const breadcrumbItems = useMemo<BreadcrumbItem[]>(() => {
        // TODO(navigation): move this to utility class
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
            subtitle: "Workspace",
            icon: (size) => <LuUser size={size} color="#8A8B8C" />,
            options: workspaceOptions,
            onSelect: (value) => onWorkspaceSelect?.(value),
        });

        // 2. View Mode Dropdown
        const viewModeLabels: Record<ViewMode, string> = {
            diagrams: "Diagrams",
            model: "Model",
            deployment: "Deployment",
        };

        items.push({
            label: viewModeLabels[viewMode],
            subtitle: "View Mode",
            icon: (size) => <LuWorkflow size={size} color="#8A8B8C" />,
            options: [
                { label: "Diagrams", value: "diagrams" },
                { label: "Model", value: "model" },
                { label: "Deployment", value: "deployment" },
            ],
            onSelect: (value) => handleViewModeChange(value as ViewMode),
        });

        // 3. Drill-down based on view mode
        if (viewMode === "diagrams" && currentView) {
            // Include root System Landscape if we are in diagram mode
            items.push({
                label: ViewType.SystemLandscape,
                subtitle: "System Landscape",
                icon: (size) => <LayerIcon size={size} layer={1} />,
                onClick: () => {
                    setCurrentView(workspace.views.systemLandscape as any);
                },
            });

            // Find elements to resolve hierarchy based on current view metadata
            // Structurizr views have keys or specific properties matching the element they describe
            if (currentView.type === ViewType.SystemContext) {
                const softwareSystem = getSoftwareSystemById(
                    currentView.softwareSystemIdentifier
                );
                const softwareSystemName =
                    currentView.title ??
                    softwareSystem?.name ??
                    "System Context";
                items.push({
                    label: softwareSystemName,
                    subtitle: "Software System",
                    icon: (size) => <LayerIcon size={size} layer={2} />,
                    onClick: () => {
                        setCurrentView(
                            workspace.views.systemContexts.find(
                                (view: ISystemContextView) =>
                                    view.softwareSystemIdentifier ===
                                    currentView.softwareSystemIdentifier
                            ) as any
                        );
                    },
                });
            } else if (currentView.type === ViewType.Container) {
                const softwareSystem = getSoftwareSystemById(
                    currentView.softwareSystemIdentifier
                );
                const softwareSystemName =
                    currentView.title ?? softwareSystem?.name ?? "Container";
                items.push({
                    label: softwareSystemName,
                    subtitle: "Software System",
                    icon: (size) => <LayerIcon size={size} layer={2} />,
                    onClick: () => {},
                });
            } else if (currentView.type === ViewType.Component) {
                const softwareSystemId = getElementParentId(
                    currentView.containerIdentifier
                )!;
                const softwareSystem = getSoftwareSystemById(softwareSystemId);
                const softwareSystemName = softwareSystem?.name ?? "Container";
                items.push({
                    label: softwareSystemName,
                    subtitle: "Container View",
                    icon: (size) => <LayerIcon size={size} layer={2} />,
                    onClick: () => {
                        setCurrentView(
                            workspace.views.containers.find(
                                (view: IContainerView) =>
                                    view.softwareSystemIdentifier ===
                                    softwareSystemId
                            ) as any
                        );
                    },
                });

                const container = getContainerById(
                    currentView.containerIdentifier
                );
                const containerName =
                    currentView.title ?? container?.name ?? "Component";
                items.push({
                    label: containerName,
                    subtitle: "Component View",
                    icon: (size) => <LayerIcon size={size} layer={3} />,
                    onClick: () => {},
                });
            }
        } else if (viewMode === "deployment" && currentView) {
            const environmentName =
                (currentView as any).environment || currentView.key;
            items.push({
                label: environmentName,
                subtitle: "Deployment",
                icon: (size) => <LuContainer size={size} color="#8A8B8C" />,
                options:
                    workspace.views.deployments?.map(
                        (deployment: IDeploymentView) => ({
                            label: deployment.environment,
                            value: deployment.key ?? deployment.environment,
                        })
                    ) || [],
                onSelect: (value) => {
                    const view = workspace.views.deployments?.find(
                        (deployment: IDeploymentView) =>
                            deployment.key === value
                    );
                    if (view) setCurrentView(view);
                },
            });
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
            <Workspace>
                <ViewportProvider>
                    <Viewport>
                        {currentView &&
                            currentView?.type === ViewType.SystemLandscape && (
                                <SystemLandscapeDiagram value={currentView} />
                            )}
                        {currentView &&
                            currentView?.type === ViewType.SystemContext && (
                                <SystemContextDiagram
                                    key={currentView.key}
                                    value={currentView}
                                />
                            )}
                        {currentView &&
                            currentView?.type === ViewType.Container && (
                                <ContainerDiagram
                                    key={currentView.key}
                                    value={currentView}
                                />
                            )}
                        {currentView &&
                            currentView?.type === ViewType.Component && (
                                <ComponentDiagram
                                    key={currentView.key}
                                    value={currentView}
                                />
                            )}
                        {currentView &&
                            currentView?.type === ViewType.Deployment && (
                                <DeploymentDiagram
                                    key={currentView.key}
                                    value={currentView}
                                />
                            )}
                        {currentView?.type === ViewType.Model && (
                            <ModelDiagram value={currentView as any} />
                        )}

                        <Themes url={workspace.views.configuration.themes} />
                        <Styles value={workspace.views.configuration.styles} />
                    </Viewport>

                    <Breadcrumbs items={breadcrumbItems} />
                    <ZoomControls />
                </ViewportProvider>
            </Workspace>
        </Flex>
    );
};

const ElementOverlay = ({
    element,
    bounds,
    state,
}: {
    element: any;
    bounds: any;
    state: any;
}) => {
    const { zoomIntoElement, zoomOutOfElement } = useViewNavigation();
    if (!state.isHovered && !state.isSelected) return null;

    if (
        element.type === "Person" ||
        element.type === "Component" ||
        element.type === "Group"
    ) {
        return null;
    }

    const isZoomOut = state.isBoundary;

    return (
        <ButtonGroup
            position="absolute"
            top={0}
            right={2}
            bg="#222425"
            borderRadius="md"
            border="1px solid"
            borderColor="#535354"
            gap={1}
            boxShadow="lg"
            alignItems="center"
            zIndex={100}
        >
            <IconButton
                aria-label={isZoomOut ? "Zoom Out" : "Zoom In"}
                size="xs"
                variant="ghost"
                onClick={(e) => {
                    e.stopPropagation();
                    isZoomOut
                        ? zoomOutOfElement(element)
                        : zoomIntoElement(element);
                }}
                _hover={{ bg: "#333536" }}
            >
                {isZoomOut ? (
                    <LuZoomOut color="#A1A2A3" />
                ) : (
                    <LuZoomIn color="#A1A2A3" />
                )}
            </IconButton>
        </ButtonGroup>
    );
};

export const WorkspacePreview = (props: WorkspacePreviewProps) => {
    return (
        <WorkspaceProvider
            workspace={props.workspace}
            setWorkspace={props.setWorkspace as any}
            renderElementOverlay={(element, bounds, state) => (
                <ElementOverlay
                    element={element}
                    bounds={bounds}
                    state={state}
                />
            )}
        >
            <ViewNavigationProvider>
                <WorkspacePreviewContent {...props} />
            </ViewNavigationProvider>
        </WorkspaceProvider>
    );
};
