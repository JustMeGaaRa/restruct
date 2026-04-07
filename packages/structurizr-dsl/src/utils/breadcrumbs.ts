import {
    ElementType,
    IElement,
    IWorkspace,
    View,
    ViewType,
} from "../interfaces";
import {
    createDefaultComponentView,
    createDefaultContainerView,
    createDefaultSystemContextView,
    createDefaultSystemLandscapeView,
} from "./views";

export type ViewPathItem = {
    index: number;
    element: IElement | undefined;
    view: View;
};

// prettier-ignore
export const zoomIntoElementScope = (workspace: IWorkspace, targetScopeElement: IElement): Array<ViewPathItem> => {
    if (!workspace) {
        throw new Error("Workspace cannot be undefined");
    }

    if (!targetScopeElement) {
        throw new Error("Element cannot be undefined");
    }

    if (
        targetScopeElement.type === ElementType.Person ||
        targetScopeElement.type === ElementType.Component
    ) {
        throw new Error(
            `View for ${targetScopeElement.type} type in scope is not supported.`
        );
    }

    const workspaceSoftwareSystems = workspace.model.groups
        .flatMap((group) => group.softwareSystems)
        .concat(workspace.model.softwareSystems);
    for (const softwareSystem of workspaceSoftwareSystems) {
        const softwareSystemContainers = softwareSystem.groups
            .flatMap((group) => group.containers)
            .concat(softwareSystem.containers);

        for (const container of softwareSystemContainers) {
            if (container.identifier === targetScopeElement.identifier) {
                // NOTE: return the path inline to optimize performance and only if the container element was found
                // NOTE: include the deeper level views because we are zooming into the element scope
                return [
                    {
                        index: 0,
                        element: softwareSystem,
                        view: workspace.views.systemContexts.find((view) => view.softwareSystemIdentifier === softwareSystem.identifier)
                            ?? createDefaultSystemContextView(softwareSystem.identifier),
                    },
                    {
                        index: 1,
                        element: softwareSystem,
                        view: workspace.views.containers.find((view) => view.softwareSystemIdentifier === softwareSystem.identifier)
                            ?? createDefaultContainerView(softwareSystem.identifier),
                    },
                    {
                        index: 2,
                        element: container,
                        view: workspace.views.components.find((view) => view.containerIdentifier === container.identifier)
                            ?? createDefaultComponentView(container.identifier),
                    },
                ];
            }
        }

        if (softwareSystem.identifier === targetScopeElement.identifier) {
            // NOTE: return the path inline to optimize performance and only if the container was not found but software system was
            // NOTE: include the deeper level views because we are zooming into the element scope
            return [
                {
                    index: 0,
                    element: softwareSystem,
                    view: workspace.views.systemContexts.find((view) => view.softwareSystemIdentifier === softwareSystem.identifier)
                        ?? createDefaultSystemContextView(softwareSystem.identifier),
                },
                {
                    index: 1,
                    element: softwareSystem,
                    view: workspace.views.containers.find((view) => view.softwareSystemIdentifier === softwareSystem.identifier)
                        ?? createDefaultContainerView(softwareSystem.identifier),
                },
            ];
        }
    }

    // NOTE: this error is reachable only if element type is allowed but not found in workspace
    throw new Error(`Element with identifier ${targetScopeElement.identifier} not found in workspace`);
};

// prettier-ignore
export const zoomOutToParentScope = (workspace: IWorkspace, currentScopeElement: IElement | undefined): Array<ViewPathItem> => {
    if (!workspace) {
        throw new Error("Workspace cannot be undefined");
    }

    if (
        currentScopeElement?.type === ElementType.Person ||
        currentScopeElement?.type === ElementType.Component
    ) {
        throw new Error(
            `View for ${currentScopeElement?.type} type in scope is not supported.`
        );
    }

    const workspaceSoftwareSystems = workspace.model.groups
        .flatMap((group) => group.softwareSystems)
        .concat(workspace.model.softwareSystems);
    for (const softwareSystem of workspaceSoftwareSystems) {
        const softwareSystemContainers = softwareSystem.groups
            .flatMap((group) => group.containers)
            .concat(softwareSystem.containers);

        for (const container of softwareSystemContainers) {
            if (container.identifier === currentScopeElement?.identifier) {
                // NOTE: return the path here only if the container element was found to optimize performance
                // NOTE: include the outer level views because we are zooming out of the element scope
                return [
                    {
                        index: 0,
                        element: softwareSystem,
                        view: workspace.views.systemContexts.find((view) => view.softwareSystemIdentifier === softwareSystem.identifier)
                            ?? createDefaultSystemContextView(softwareSystem.identifier),
                    },
                    {
                        index: 1,
                        element: softwareSystem,
                        view: workspace.views.containers.find((view) => view.softwareSystemIdentifier === softwareSystem.identifier)
                            ?? createDefaultContainerView(softwareSystem.identifier),
                    }
                ];
            }
        }

        if (softwareSystem.identifier === currentScopeElement?.identifier) {
            // NOTE: return the path here only if the container was not found but software system was, to optimize performance
            // NOTE: include the outer level views because we are zooming out of the element scope
            return [
                {
                    index: 0,
                    element: softwareSystem,
                    view: workspace.views.systemContexts.find((view) => view.softwareSystemIdentifier === softwareSystem.identifier)
                        ?? createDefaultSystemContextView(softwareSystem.identifier),
                }
            ];
        }
    }

    // NOTE: this return is only reachable if zooming out to the System Landscape scope
    return [
        {
            index: 0,
            element: undefined,
            view: workspace.views.systemLandscape ?? createDefaultSystemLandscapeView(),
        }
    ]
};

export const getViewPathTitle = (item: ViewPathItem): string => {
    return (
        item.view.title ??
        item.element?.name ??
        (item.view.type === ViewType.Deployment
            ? item.view.environment
            : item.view.type)
    );
};

/**
 * Returns the list of system context view options for a given software system.
 * NOTE: a system context view is scoped to a software system,
 * so to switch between system context views we need software system identifiers.
 * @param workspace The workspace to get the system context view options from.
 * @returns The list of system context view options.
 */
export const getSystemContextViewOptions = (
    workspace: IWorkspace
): Array<ViewPathItem> => {
    const softwareSystems = workspace.model.groups
        .flatMap((group) => group.softwareSystems)
        .concat(workspace.model.softwareSystems);
    return softwareSystems.map((softwareSystem, index) => {
        return {
            index: index,
            element: softwareSystem,
            view:
                workspace.views.systemContexts.find(
                    (view) =>
                        view.softwareSystemIdentifier ===
                        softwareSystem.identifier
                ) ?? createDefaultSystemContextView(softwareSystem.identifier),
        };
    });
};

/**
 * Returns the list of container view options for a given software system.
 * NOTE: a container view is scoped to a software system,
 * so to switch between container views we need software system identifiers.
 * @param workspace The workspace to get the container view options from.
 * @returns The list of container view options.
 */
export const getContainerViewOptions = (
    workspace: IWorkspace
): Array<ViewPathItem> => {
    const softwareSystems = workspace.model.groups
        .flatMap((group) => group.softwareSystems)
        .concat(workspace.model.softwareSystems);
    return softwareSystems.map((softwareSystem, index) => {
        return {
            index: index,
            element: softwareSystem,
            view:
                workspace.views.containers.find(
                    (view) =>
                        view.softwareSystemIdentifier ===
                        softwareSystem.identifier
                ) ?? createDefaultContainerView(softwareSystem.identifier),
        };
    });
};

/**
 * Returns the list of component view options for a given software system.
 * NOTE: a component view is scoped to a container, so to switch between component views
 * we need container identifiers within the software system.
 * @param workspace The workspace to get the component view options from.
 * @param softwareSystemIdentifier The identifier of the software system to get the containers for component view options.
 * @returns The list of component view options.
 */
export const getComponentViewOptions = (
    workspace: IWorkspace,
    softwareSystemIdentifier: string
): Array<ViewPathItem> => {
    const containers = workspace.model.groups
        .flatMap((group) => group.softwareSystems)
        .concat(workspace.model.softwareSystems)
        .filter(
            (softwareSystem) =>
                softwareSystem.identifier === softwareSystemIdentifier
        )
        .flatMap((softwareSystem) =>
            softwareSystem.groups
                .flatMap((group) => group.containers)
                .concat(softwareSystem.containers)
        );
    return containers.map((container, index) => {
        return {
            index: index,
            element: container,
            view:
                workspace.views.components.find(
                    (view) => view.containerIdentifier === container.identifier
                ) ?? createDefaultComponentView(container.identifier),
        };
    });
};

export const getDeploymentViewOptions = (
    workspace: IWorkspace
): Array<ViewPathItem> => {
    return workspace.views.deployments.map((deployment, index) => {
        return {
            index: index,
            element: undefined,
            view: deployment,
        };
    });
};
