import {
    findAnyExisting,
    findViewByType,
    IContainerView,
    IDeploymentView,
    ISystemContextView,
    IWorkspace,
    ViewType,
    fetchThemes,
    createDefaultModelView,
} from "@restruct/structurizr-dsl";
import {
    WorkspaceProvider,
    useViewNavigation,
    WorkspaceDiagramPreview,
    useWorkspace,
    useThemes,
} from "@restruct/structurizr-react";
import { LuWorkflow, LuUser, LuContainer } from "react-icons/lu";
import {
    useState,
    useEffect,
    useMemo,
    useCallback,
    FC,
    Dispatch,
    SetStateAction,
} from "react";
import { ElementControlsOverlay } from "./ElementControlsOverlay";
import { ZoomControls } from "./ZoomControls";
import { Breadcrumbs, BreadcrumbItem } from "./Breadcrumbs";
import { LayerIcon } from "./LayerIcon";

type ViewMode = "diagrams" | "model" | "deployment";

export interface WorkspacePreviewProps {
    workspace: IWorkspace;
    setWorkspace: Dispatch<SetStateAction<IWorkspace>>;
    availableWorkspaces: { id?: string; name: string }[];
    onWorkspaceSelect?: (idOrName: string) => void;
}

export const WorkspacePreview: FC<WorkspacePreviewProps> = ({
    workspace,
    availableWorkspaces,
    setWorkspace,
    onWorkspaceSelect,
}) => {
    const { setThemes, setStyles } = useThemes();

    useEffect(() => {
        const fetchAndApplyThemes = async () => {
            const themes = await fetchThemes(
                workspace.views.configuration.themes
            );
            setThemes(themes);
            setStyles(workspace.views.configuration.styles);
        };
        fetchAndApplyThemes();
    }, [setThemes, setStyles, workspace.views.configuration]);

    const [viewMode, setViewMode] = useState<ViewMode>("diagrams");
    const { getSoftwareSystemById, getContainerById, getElementParentId } =
        useWorkspace();
    const { currentView, setCurrentView } = useViewNavigation();

    const handleViewModeChange = useCallback(
        (view: ViewMode) => {
            setViewMode(view);
            if (view === "diagrams") {
                setCurrentView(findAnyExisting(workspace)!);
            } else if (view === "model") {
                setCurrentView(createDefaultModelView());
            } else if (view === "deployment") {
                setCurrentView(findViewByType(workspace, ViewType.Deployment)!);
            }
        },
        [workspace, setCurrentView]
    );

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
        workspace?.name,
        workspace.views.systemLandscape,
        workspace.views.systemContexts,
        workspace.views.containers,
        workspace.views.deployments,
        availableWorkspaces,
        viewMode,
        currentView,
        onWorkspaceSelect,
        handleViewModeChange,
        setCurrentView,
        getSoftwareSystemById,
        getElementParentId,
        getContainerById,
    ]);

    return (
        <WorkspaceProvider
            workspace={workspace}
            setWorkspace={setWorkspace}
            renderElementOverlay={(element, _, state) => (
                <ElementControlsOverlay element={element} state={state} />
            )}
        >
            <WorkspaceDiagramPreview currentView={currentView}>
                <Breadcrumbs items={breadcrumbItems} />
                <ZoomControls />
            </WorkspaceDiagramPreview>
        </WorkspaceProvider>
    );
};
