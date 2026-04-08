import {
    IWorkspace,
    ISystemLandscapeView,
    AutoLayoutDirection,
    ISystemContextView,
    IContainerView,
    IComponentView,
    IDeploymentView,
    IModelView,
    IConfiguration,
    ViewType,
    IViews,
    View,
} from "../interfaces";
import {
    ComponentView,
    Configuration,
    ContainerView,
    DeploymentView,
    SystemContextView,
    SystemLandscapeView,
} from "../models";
import {
    getWorkspaceContainers,
    // getWorkspaceDeploymentEnvironments,
    getWorkspaceSoftwareSystems,
} from "./model";
import { createUniqueId } from "./identifier";

export const createDefaultSystemLandscapeView = (): ISystemLandscapeView => {
    const uniqueId = createUniqueId();
    return new SystemLandscapeView({
        key: `system_landscape_view_${uniqueId}`,
        include: [],
        autoLayout: {
            direction: AutoLayoutDirection.TopBotom,
            rankSeparation: 300,
            nodeSeparation: 300,
        },
    }).toSnapshot();
};

export const createDefaultSystemContextView = (
    softwareSystemIdentifier: string
): ISystemContextView => {
    const uniqueId = createUniqueId();
    return new SystemContextView({
        softwareSystemIdentifier,
        key: `system_context_view_${uniqueId}`,
        include: [],
        autoLayout: {
            direction: AutoLayoutDirection.TopBotom,
            rankSeparation: 300,
            nodeSeparation: 300,
        },
    }).toSnapshot();
};

export const createDefaultContainerView = (
    softwareSystemIdentifier: string
): IContainerView => {
    const uniqueId = createUniqueId();
    return new ContainerView({
        softwareSystemIdentifier,
        key: `container_view_${uniqueId}`,
        include: [],
        autoLayout: {
            direction: AutoLayoutDirection.TopBotom,
            rankSeparation: 300,
            nodeSeparation: 300,
        },
    }).toSnapshot();
};

export const createDefaultComponentView = (
    containerIdentifier: string
): IComponentView => {
    const uniqueId = createUniqueId();
    return new ComponentView({
        containerIdentifier,
        key: `component_view_${uniqueId}`,
        include: [],
        autoLayout: {
            direction: AutoLayoutDirection.TopBotom,
            rankSeparation: 300,
            nodeSeparation: 300,
        },
    }).toSnapshot();
};

export const createDefaultDeploymentView = (
    environment: string,
    softwareSystemIdentifier: string
): IDeploymentView => {
    return new DeploymentView({
        softwareSystemIdentifier,
        environment,
        title: `Deployment for ${environment}`,
        autoLayout: {
            direction: AutoLayoutDirection.TopBotom,
            rankSeparation: 300,
            nodeSeparation: 300,
        },
    }).toSnapshot();
};

export const createDefaultModelView = (): IModelView => {
    return {
        type: ViewType.Model,
        key: "model_view",
    };
};

export const createDefaultConfiguration = (): IConfiguration => {
    return new Configuration({
        styles: {
            elements: [],
            relationships: [],
        },
        themes: [],
    }).toSnapshot();
};

export const getViewsWithDefaults = (workspace: IWorkspace): IViews => {
    const softwareSystems = getWorkspaceSoftwareSystems(workspace.model);
    // const deploymentEnvironments = getWorkspaceDeploymentEnvironments(
    //     workspace.model
    // );

    const views = {
        ...workspace.views,
        systemLandscape:
            workspace.views.systemLandscape ??
            createDefaultSystemLandscapeView(),
        systemContexts: [
            ...workspace.views.systemContexts,
            ...softwareSystems
                .filter(
                    (softwareSystem) =>
                        !workspace.views.systemContexts.some(
                            (existingView) =>
                                existingView.softwareSystemIdentifier ===
                                softwareSystem.identifier
                        )
                )
                .map(
                    (softwareSystem) =>
                        workspace.views.systemContexts.find(
                            (existingView) =>
                                existingView.softwareSystemIdentifier ===
                                softwareSystem.identifier
                        ) ??
                        createDefaultSystemContextView(
                            softwareSystem.identifier
                        )
                ),
        ],
        containers: [
            ...workspace.views.containers,
            ...softwareSystems
                .filter(
                    (softwareSystem) =>
                        !workspace.views.containers.some(
                            (existingView) =>
                                existingView.softwareSystemIdentifier ===
                                softwareSystem.identifier
                        )
                )
                .map(
                    (softwareSystem) =>
                        workspace.views.containers.find(
                            (existingView) =>
                                existingView.softwareSystemIdentifier ===
                                softwareSystem.identifier
                        ) ??
                        createDefaultContainerView(softwareSystem.identifier)
                ),
        ],
        components: [
            ...workspace.views.components,
            ...getWorkspaceContainers(workspace.model)
                .filter(
                    (container) =>
                        !workspace.views.components.some(
                            (existingView) =>
                                existingView.containerIdentifier ===
                                container.identifier
                        )
                )
                .map(
                    (container) =>
                        workspace.views.components.find(
                            (existingView) =>
                                existingView.containerIdentifier ===
                                container.identifier
                        ) ?? createDefaultComponentView(container.identifier)
                ),
        ],
        // TODO (deployment): review how and if default deployment views should be created
        // deployments: softwareSystems.flatMap((softwareSystem) =>
        //     deploymentEnvironments.map(
        //         (deployment) =>
        //             workspace.views.deployments.find(
        //                 (existingView) =>
        //                     existingView.environment === deployment.name &&
        //                     existingView.softwareSystemIdentifier ===
        //                         softwareSystem.identifier
        //             ) ??
        //             createDefaultDeploymentView(
        //                 deployment.name,
        //                 softwareSystem.identifier
        //             )
        //     )
        // ),
    };

    return views;
};

export const getAnyByViewType = (
    views: IViews,
    viewType: ViewType
): View | undefined => {
    switch (viewType) {
        case ViewType.Model:
            return createDefaultModelView();
        case ViewType.SystemLandscape:
            return views.systemLandscape;
        case ViewType.SystemContext:
            return views.systemContexts[0];
        case ViewType.Container:
            return views.containers[0];
        case ViewType.Component:
            return views.components[0];
        case ViewType.Deployment:
            return views.deployments[0];
        default:
            return undefined;
    }
};

export const findViewByDefinition = (
    views: IViews,
    view: Partial<View>
): View | undefined => {
    return (
        [views.systemLandscape].find(
            (x) => x.key === view?.key || x.type === view?.type
        ) ??
        views.systemContexts.find(
            (x) =>
                x.key === view?.key ||
                (x.type === view?.type &&
                    x.softwareSystemIdentifier ===
                        view.softwareSystemIdentifier)
        ) ??
        views.containers.find(
            (x) =>
                x.key === view?.key ||
                (x.type === view?.type &&
                    x.softwareSystemIdentifier ===
                        view.softwareSystemIdentifier)
        ) ??
        views.components.find(
            (x) =>
                x.key === view?.key ||
                (x.type === view?.type &&
                    x.containerIdentifier === view.containerIdentifier)
        ) ??
        views.deployments.find(
            (x) =>
                x.key === view?.key ||
                (x.type === view?.type &&
                    x.softwareSystemIdentifier ===
                        view.softwareSystemIdentifier &&
                    x.environment === view.environment)
        ) ??
        [createDefaultModelView()].find(
            (x) => x.key === view?.key || x.type === view?.type
        )
    );
};

export const findViewByKey = (
    views: IViews,
    viewKey: string
): View | undefined => {
    return findViewByDefinition(views, { key: viewKey });
};

export const findViewOrDefault = <TView extends View>(
    views: IViews,
    view: View,
    defaultView: TView
): TView => {
    return (findViewByDefinition(views, view) as TView) ?? defaultView;
};

export const findAnyExisting = (views: IViews): View | undefined => {
    return (
        views.systemLandscape ??
        views.systemContexts[0] ??
        views.containers[0] ??
        views.components[0] ??
        views.deployments[0]
    );
};
