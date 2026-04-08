import {
    getAnyByViewType,
    ViewType,
    fetchThemes,
    createDefaultModelView,
    View,
    getViewPathTitle,
    getDeploymentViewOptions,
    getSystemContextViewOptions,
    getContainerViewOptions,
    getComponentViewOptions,
    findViewByKey,
} from "@restruct/structurizr-dsl";
import {
    useViewNavigation,
    WorkspaceDiagramPreview,
    useThemes,
    useWorkspace,
} from "@restruct/structurizr-react";
import { LuWorkflow, LuUser, LuContainer, LuMap } from "react-icons/lu";
import { useEffect, useMemo, FC } from "react";
import { ZoomControls } from "./ZoomControls";
import { Breadcrumbs, BreadcrumbItem } from "./Breadcrumbs";
import { LayerIcon } from "./icons";

type ViewMode = "landscape" | "diagrams" | "model" | "deployment";

function getViewTypeIcon(viewType: ViewType, size: number) {
    switch (viewType) {
        case ViewType.SystemLandscape:
            return <LuMap size={size} />;
        case ViewType.SystemContext:
            return <LayerIcon size={size} layer={1} />;
        case ViewType.Container:
            return <LayerIcon size={size} layer={2} />;
        case ViewType.Component:
            return <LayerIcon size={size} layer={3} />;
        case ViewType.Deployment:
            return <LuContainer size={size} />;
    }
}

const getViewMode = (currentView: View | undefined): ViewMode => {
    if (currentView?.type === ViewType.SystemLandscape) {
        return "landscape";
    } else if (currentView?.type === ViewType.SystemContext) {
        return "diagrams";
    } else if (currentView?.type === ViewType.Container) {
        return "diagrams";
    } else if (currentView?.type === ViewType.Component) {
        return "diagrams";
    } else if (currentView?.type === ViewType.Deployment) {
        return "deployment";
    } else if (currentView?.type === ViewType.Model) {
        return "model";
    } else {
        return "landscape";
    }
};

export interface WorkspacePreviewProps {
    availableWorkspaces: { id?: string; name: string }[];
    onWorkspaceSelect?: (idOrName: string) => void;
}

export const WorkspacePreview: FC<WorkspacePreviewProps> = ({
    availableWorkspaces,
    onWorkspaceSelect,
}) => {
    const { setThemes, setStyles } = useThemes();
    const { workspace, getElementParentId } = useWorkspace();

    const { currentView, path, navigateToView, navigateToPathSection } =
        useViewNavigation();

    useEffect(() => {
        const fetchAndApplyThemes = async () => {
            const themes = await fetchThemes(
                workspace.views.configuration.themes
            );
            setThemes(themes);
            setStyles(workspace.views.configuration.styles);
        };
        fetchAndApplyThemes();
    }, [workspace.views.configuration, setThemes, setStyles]);

    useEffect(() => {
        navigateToView(workspace.views.systemLandscape);
    }, [workspace.views.systemLandscape, navigateToView]);

    const viewMode = getViewMode(currentView);
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
            icon: (size) => <LuUser size={size} color="#8A8B8C" />,
            onSelect: (value) => onWorkspaceSelect?.(value),
        });

        // 2. View Mode Dropdown
        const viewModeLabels: Record<ViewMode, string> = {
            landscape: "System Landscape",
            diagrams: "Diagrams",
            model: "Model",
            deployment: "Deployment",
        };

        const viewModeOptions =
            workspace.views.deployments.length > 0
                ? [
                      { label: "Landscape", value: "landscape" },
                      { label: "Diagrams", value: "diagrams" },
                      { label: "Model", value: "model" },
                      { label: "Deployment", value: "deployment" },
                  ]
                : [
                      { label: "Landscape", value: "landscape" },
                      { label: "Diagrams", value: "diagrams" },
                      { label: "Model", value: "model" },
                  ];

        items.push({
            label: viewModeLabels[viewMode],
            options: viewModeOptions,
            icon: (size) => <LuWorkflow size={size} color="#8A8B8C" />,
            onSelect: (view: string) => {
                if (view === "landscape") {
                    navigateToView(workspace.views.systemLandscape);
                } else if (view === "diagrams") {
                    navigateToView(
                        getAnyByViewType(
                            workspace.views,
                            ViewType.SystemContext
                        )
                    );
                } else if (view === "model") {
                    navigateToView(createDefaultModelView());
                } else if (view === "deployment") {
                    navigateToView(
                        getAnyByViewType(workspace.views, ViewType.Deployment)
                    );
                }
            },
        });

        // 3. Drill-down based on view mode
        if (viewMode === "diagrams" || viewMode === "deployment") {
            path.forEach((item) => {
                const options =
                    item.view.type === ViewType.SystemContext
                        ? getSystemContextViewOptions(workspace)
                        : item.view.type === ViewType.Container
                          ? getContainerViewOptions(workspace)
                          : item.view.type === ViewType.Component
                            ? getComponentViewOptions(
                                  workspace,
                                  getElementParentId(
                                      item.view.containerIdentifier
                                  )!
                              )
                            : item.view.type === ViewType.Deployment
                              ? getDeploymentViewOptions(workspace)
                              : [];
                items.push({
                    label: getViewPathTitle(item),
                    options: options.map((item) => ({
                        label: getViewPathTitle(item),
                        value: item.view.key,
                    })),
                    icon: (size) => getViewTypeIcon(item.view.type, size),
                    onClick: () => navigateToPathSection(item),
                    onSelect: (value) =>
                        navigateToView(findViewByKey(workspace.views, value)),
                });
            });
        }

        return items;
    }, [
        workspace,
        availableWorkspaces,
        viewMode,
        path,
        onWorkspaceSelect,
        navigateToView,
        getElementParentId,
        navigateToPathSection,
    ]);

    return (
        <WorkspaceDiagramPreview currentView={currentView}>
            <Breadcrumbs items={breadcrumbItems} />
            <ZoomControls />
        </WorkspaceDiagramPreview>
    );
};
