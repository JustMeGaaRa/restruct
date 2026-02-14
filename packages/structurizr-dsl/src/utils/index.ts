import {
    IContainer,
    IModel,
    IRelationship,
    ISoftwareSystem,
    IWorkspace,
    ITheme,
    View,
    ITag,
    ViewType,
    IComponent,
} from "../interfaces";
import { Style } from "../models";

export function foldStyles<
    TStyleProperties extends { [key: string]: unknown },
    TTagStyle extends Style<TStyleProperties>,
>(
    style: TStyleProperties,
    tagStyles: TTagStyle[],
    tags: ITag[]
): TStyleProperties {
    const applyStyle = (
        style: TStyleProperties,
        tagStyle: Partial<TStyleProperties>
    ) => {
        return Object.fromEntries(
            Object.entries({ ...style, ...tagStyle }).map(([key, value]) => [
                key,
                value !== undefined ? value : style[key],
            ])
        ) as TStyleProperties;
    };

    return tags
        ? tags.reduce((state, tag) => {
              const tagStyle = tagStyles.find((x) => x.tag === tag.name);
              return tagStyle ? applyStyle(state, tagStyle) : state;
          }, style)
        : style;
}

export const applyTheme = (
    workspace: IWorkspace,
    theme: ITheme
): IWorkspace => {
    const elements = workspace.views.configuration.styles.elements;
    const relationships = workspace.views.configuration.styles.relationships;

    return {
        ...workspace,
        views: {
            ...workspace.views,
            configuration: {
                ...workspace.views.configuration,
                styles: {
                    ...workspace.views.configuration.styles,
                    elements: elements.concat(theme.elements ?? []),
                    relationships: relationships.concat(
                        theme.relationships ?? []
                    ),
                },
            },
        },
    };
};

export const fetchTheme = async (url: string): Promise<ITheme> => {
    const themeResponse = await fetch(url);
    if (!themeResponse.ok) throw new Error(`Theme not found`);
    return (await themeResponse.json()) as ITheme;
};

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

export const findElement = (
    model: IModel,
    identifier: string
): ISoftwareSystem | IContainer | IComponent | undefined => {
    const softwareSystems = model.groups
        .flatMap((group) => group.softwareSystems)
        .concat(model.softwareSystems);

    for (const softwareSystem of softwareSystems) {
        if (softwareSystem.identifier === identifier) {
            return softwareSystem;
        }

        const containers = softwareSystem.groups
            .flatMap((group) => group.containers)
            .concat(softwareSystem.containers);

        for (const container of containers) {
            if (container.identifier === identifier) {
                return container;
            }

            const components = container.groups
                .flatMap((group) => group.components)
                .concat(container.components);

            for (const component of components) {
                if (component.identifier === identifier) {
                    return component;
                }
            }
        }
    }

    return undefined;
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

export const findSoftwareSystem = (model: IModel, identifier: string) => {
    return model.softwareSystems
        .concat(model.groups.flatMap((x) => x.softwareSystems))
        .find((x) => x.identifier === identifier);
};

export const findContainer = (model: IModel, identifier: string) => {
    return model.softwareSystems
        .flatMap((x) => x.containers)
        .concat(
            model.groups
                .flatMap((x) => x.softwareSystems)
                .flatMap((x) => x.containers)
        )
        .find((x) => x.identifier === identifier);
};

export const findContainerParent = (
    model: IModel,
    containerId: string
): ISoftwareSystem | undefined => {
    return model.softwareSystems
        .concat(model.groups.flatMap((x) => x.softwareSystems))
        .find((x) => x.containers.some((c) => c.identifier === containerId));
};

export const findComponentParent = (
    model: IModel,
    componentId: string
): IContainer | undefined => {
    const groupContainers = model.groups
        .flatMap((x) => x.softwareSystems)
        .flatMap((x) => x.containers);
    const softwareSystemContainers = model.softwareSystems.flatMap(
        (x) => x.containers
    );
    return softwareSystemContainers
        .concat(groupContainers)
        .find((x) => x.components.some((c) => c.identifier === componentId));
};

export const isRelationshipBetweenElementsInView = (
    elementsInView: Set<string> | Map<string, string>,
    relationship: IRelationship
) => {
    return (
        elementsInView.has(relationship.sourceIdentifier) &&
        elementsInView.has(relationship.targetIdentifier)
    );
};

export const isElementExplicitlyIncludedInView = (
    view: { include?: string[] },
    elementIdentifier: string
) => {
    return view.include?.includes(elementIdentifier);
};

export * from "./guards";
export * from "./relationship";
export * from "./string";
