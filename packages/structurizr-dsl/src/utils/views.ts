import {
    IContainer,
    IModel,
    ISoftwareSystem,
    IWorkspace,
    View,
    ViewType,
    IComponent,
} from "../interfaces";

export const findViewByKey = (
    workspace: IWorkspace,
    viewKey: string
): View | undefined => {
    return (
        [workspace.views.systemLandscape].find((x) => x?.key === viewKey) ??
        workspace.views.systemContexts.find((x) => x.key === viewKey) ??
        workspace.views.containers.find((x) => x.key === viewKey) ??
        workspace.views.components.find((x) => x.key === viewKey) ??
        workspace.views.deployments.find((x) => x.key === viewKey)
    );
};

export const findViewForElement = (
    workspace: IWorkspace,
    viewType: ViewType,
    elementIdentifier?: string
): View | undefined => {
    return (
        [workspace.views.systemLandscape].find((x) => x?.type === viewType) ??
        workspace.views.systemContexts.find(
            (x) =>
                x.type === viewType &&
                x.softwareSystemIdentifier === elementIdentifier
        ) ??
        workspace.views.containers.find(
            (x) =>
                x.type === viewType &&
                x.softwareSystemIdentifier === elementIdentifier
        ) ??
        workspace.views.components.find(
            (x) =>
                x.type === viewType &&
                x.containerIdentifier === elementIdentifier
        ) ??
        workspace.views.deployments.find(
            (x) =>
                x.type === viewType &&
                x.softwareSystemIdentifier === elementIdentifier
        )
    );
};

export const findViewByType = (
    workspace: IWorkspace,
    viewType?: ViewType
): View | undefined => {
    return (
        [workspace.views.systemLandscape].find((x) => x?.type === viewType) ??
        workspace.views.systemContexts.find((x) => x.type === viewType) ??
        workspace.views.containers.find((x) => x.type === viewType) ??
        workspace.views.components.find((x) => x.type === viewType) ??
        workspace.views.deployments.find((x) => x.type === viewType)
    );
};

export const findAnyExisting = (workspace: IWorkspace): View | undefined => {
    return (
        workspace.views.systemLandscape ??
        workspace.views.systemContexts[0] ??
        workspace.views.containers[0] ??
        workspace.views.components[0] ??
        workspace.views.deployments[0]
    );
};

export const findElementPath = (
    model: IModel,
    identifier: string
): Array<ISoftwareSystem | IContainer | IComponent> => {
    const softwareSystems = model.groups
        .flatMap((group) => group.softwareSystems)
        .concat(model.softwareSystems);

    for (const softwareSystem of softwareSystems) {
        const containers = softwareSystem.groups
            .flatMap((group) => group.containers)
            .concat(softwareSystem.containers);

        for (const container of containers) {
            const components = container.groups
                .flatMap((group) => group.components)
                .concat(container.components);

            for (const component of components) {
                if (component.identifier === identifier) {
                    return [softwareSystem, container, component];
                }
            }

            if (container.identifier === identifier) {
                return [softwareSystem, container];
            }
        }

        if (softwareSystem.identifier === identifier) {
            return [softwareSystem];
        }
    }

    return [];
};
