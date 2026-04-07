import { IModel, ISoftwareSystem, IContainer, IComponent } from "../interfaces";

export const findElementPath = (
    model: IModel,
    elementIdentifier: string
): Array<ISoftwareSystem | IContainer | IComponent> => {
    const softwareSystems = getWorkspaceSoftwareSystems(model);

    for (const softwareSystem of softwareSystems) {
        const containers = softwareSystem.groups
            .flatMap((group) => group.containers)
            .concat(softwareSystem.containers);

        for (const container of containers) {
            const components = container.groups
                .flatMap((group) => group.components)
                .concat(container.components);

            for (const component of components) {
                if (component.identifier === elementIdentifier) {
                    return [softwareSystem, container, component];
                }
            }

            if (container.identifier === elementIdentifier) {
                return [softwareSystem, container];
            }
        }

        if (softwareSystem.identifier === elementIdentifier) {
            return [softwareSystem];
        }
    }

    return [];
};

// TODO: consider an approach to merge this and workspace explorer duplicate functions
export const getWorkspaceSoftwareSystems = (model: IModel) => {
    return model.groups
        .flatMap((group) => group.softwareSystems)
        .concat(model.softwareSystems);
};

export const getWorkspaceContainers = (model: IModel) => {
    const softwareSystems = getWorkspaceSoftwareSystems(model);
    return softwareSystems.flatMap((softwareSystem) => [
        ...softwareSystem.containers,
        ...softwareSystem.groups.flatMap((group) => group.containers),
    ]);
};

export const getWorkspaceComponents = (model: IModel) => {
    const softwareSystems = getWorkspaceSoftwareSystems(model);
    return softwareSystems.flatMap((softwareSystem) => [
        ...softwareSystem.containers,
        ...softwareSystem.groups.flatMap((group) => group.containers),
    ]);
};

export const getWorkspacePeople = (model: IModel) => {
    return model.groups.flatMap((group) => group.people).concat(model.people);
};

export const getWorkspaceDeploymentEnvironments = (model: IModel) => {
    return model.deploymentEnvironments;
};
