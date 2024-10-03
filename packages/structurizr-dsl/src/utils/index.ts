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
    RelationshipType,
    IComponent,
} from "../interfaces";
import { Style } from "../models";

export function foldStyles<
    TStyleProperties extends { [key: string]: any },
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

    for (let softwareSystem of softwareSystems) {
        if (softwareSystem.identifier === identifier) {
            return softwareSystem;
        }

        const containers = softwareSystem.groups
            .flatMap((group) => group.containers)
            .concat(softwareSystem.containers);

        for (let container of containers) {
            if (container.identifier === identifier) {
                return container;
            }

            const components = container.groups
                .flatMap((group) => group.components)
                .concat(container.components);

            for (let component of components) {
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

    for (let softwareSystem of softwareSystems) {
        const containers = softwareSystem.groups
            .flatMap((group) => group.containers)
            .concat(softwareSystem.containers);

        for (let container of containers) {
            const components = container.groups
                .flatMap((group) => group.components)
                .concat(container.components);

            for (let component of components) {
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

export const relationshipExistsOverall = (
    relationships: IRelationship[],
    sourceIdentifier: string,
    targetIdentifier: string
) => {
    return relationships.some(
        (x) =>
            (x.sourceIdentifier === sourceIdentifier &&
                x.targetIdentifier === targetIdentifier) ||
            (x.sourceIdentifier === targetIdentifier &&
                x.targetIdentifier === sourceIdentifier)
    );
};

export const relationshipExistsForElementsInView = (
    elementsInView: Set<string>,
    relationship: IRelationship
) => {
    return (
        elementsInView.has(relationship.sourceIdentifier) &&
        elementsInView.has(relationship.targetIdentifier)
    );
};

export const elementIncludedInView = (
    view: View,
    elementIdentifier: string
) => {
    switch (view.type) {
        case ViewType.SystemLandscape:
        case ViewType.SystemContext:
        case ViewType.Container:
        case ViewType.Component:
        case ViewType.Deployment:
            return view.include?.some(
                (identifier) => identifier === elementIdentifier
            );
        default:
            return false;
    }
};

export const getRelationships = (model: IModel, implied: boolean) => {
    const relationships = Array.from<IRelationship>([]);

    // TODO: optimize performance by caching the relationships
    // TODO: implied relationships should have same attributes as the original relationship
    // TODO: exclude implied relationships from child to it's own parent
    // TODO: include implied relationships from element scope with this template 'someId -> this'

    function addRelationship(
        source: string,
        target: string,
        description?: string
    ) {
        if (
            !relationships.some(
                (x) =>
                    x.sourceIdentifier === source &&
                    x.targetIdentifier === target
            )
        ) {
            relationships.push({
                type: RelationshipType.Relationship,
                identifier: `${source}-${target}`,
                sourceIdentifier: source,
                targetIdentifier: target,
                description,
                tags: [],
            });
        }
    }

    model.groups
        .flatMap((x) => x.softwareSystems)
        .concat(model.softwareSystems)
        .forEach((system) => {
            // Implied relationships from current system to target
            system.groups
                .flatMap((x) => x.containers)
                .concat(system.containers)
                .forEach((container) => {
                    // Implied relationships from current container to target
                    container.groups
                        .flatMap((x) => x.components)
                        .concat(container.components)
                        .forEach((component) => {
                            // Implied relationships from component scope to target
                            component.relationships.forEach((relationship) => {
                                addRelationship(
                                    component.identifier,
                                    relationship.targetIdentifier,
                                    relationship.description
                                );

                                if (implied) {
                                    addRelationship(
                                        container.identifier,
                                        relationship.targetIdentifier,
                                        relationship.description
                                    );
                                    addRelationship(
                                        system.identifier,
                                        relationship.targetIdentifier,
                                        relationship.description
                                    );
                                }
                            });

                            // Implied relationships outgoing from current component
                            model.relationships
                                .filter(
                                    (relationship) =>
                                        relationship.sourceIdentifier ===
                                        component.identifier
                                )
                                .forEach((relationship) => {
                                    addRelationship(
                                        component.identifier,
                                        relationship.targetIdentifier,
                                        relationship.description
                                    );

                                    if (implied) {
                                        addRelationship(
                                            container.identifier,
                                            relationship.targetIdentifier,
                                            relationship.description
                                        );
                                        addRelationship(
                                            system.identifier,
                                            relationship.targetIdentifier,
                                            relationship.description
                                        );
                                    }
                                });

                            // Implied relationships incoming into current component
                            model.relationships
                                .filter(
                                    (relationship) =>
                                        relationship.targetIdentifier ===
                                        component.identifier
                                )
                                .forEach((relationship) => {
                                    addRelationship(
                                        relationship.sourceIdentifier,
                                        component.identifier,
                                        relationship.description
                                    );

                                    if (implied) {
                                        addRelationship(
                                            relationship.sourceIdentifier,
                                            container.identifier,
                                            relationship.description
                                        );
                                        addRelationship(
                                            relationship.sourceIdentifier,
                                            system.identifier,
                                            relationship.description
                                        );
                                    }
                                });
                        });

                    // Implied relationships from container scope to target
                    container.relationships.forEach((relationship) => {
                        addRelationship(
                            container.identifier,
                            relationship.targetIdentifier,
                            relationship.description
                        );

                        if (implied) {
                            addRelationship(
                                system.identifier,
                                relationship.targetIdentifier,
                                relationship.description
                            );
                        }
                    });

                    // Implied relationships outgoing from current container
                    model.relationships
                        .filter(
                            (relationship) =>
                                relationship.sourceIdentifier ===
                                container.identifier
                        )
                        .forEach((relationship) => {
                            addRelationship(
                                container.identifier,
                                relationship.targetIdentifier,
                                relationship.description
                            );

                            if (implied) {
                                addRelationship(
                                    system.identifier,
                                    relationship.targetIdentifier,
                                    relationship.description
                                );
                            }
                        });

                    // Implied relationships incoming into current container
                    model.relationships
                        .filter(
                            (relationship) =>
                                relationship.targetIdentifier ===
                                container.identifier
                        )
                        .forEach((relationship) => {
                            addRelationship(
                                relationship.sourceIdentifier,
                                container.identifier,
                                relationship.description
                            );

                            if (implied) {
                                addRelationship(
                                    relationship.sourceIdentifier,
                                    system.identifier,
                                    relationship.description
                                );
                            }
                        });
                });

            // Implied relationships from system scope to target
            system.relationships.forEach((relationship) => {
                addRelationship(
                    system.identifier,
                    relationship.targetIdentifier,
                    relationship.description
                );
            });

            // Implied relationships outgoing from current system
            model.relationships
                .filter(
                    (relationship) =>
                        relationship.sourceIdentifier === system.identifier
                )
                .forEach((relationship) => {
                    addRelationship(
                        system.identifier,
                        relationship.targetIdentifier,
                        relationship.description
                    );
                });

            // Implied relationships incoming into current system
            model.relationships
                .filter(
                    (relationship) =>
                        relationship.targetIdentifier === system.identifier
                )
                .forEach((relationship) => {
                    addRelationship(
                        relationship.sourceIdentifier,
                        system.identifier,
                        relationship.description
                    );
                });
        });

    model.groups
        .flatMap((x) => x.people)
        .concat(model.people)
        .forEach((person) => {
            person.relationships.forEach((relationship) => {
                // Implied relationships from people to systems
                model.groups
                    .flatMap((x) => x.softwareSystems)
                    .concat(model.softwareSystems)
                    .forEach((system) => {
                        if (
                            relationship.targetIdentifier === system.identifier
                        ) {
                            addRelationship(
                                person.identifier,
                                system.identifier,
                                relationship.description
                            );
                        }

                        system.groups
                            .flatMap((x) => x.containers)
                            .concat(system.containers)
                            .forEach((container) => {
                                if (
                                    relationship.targetIdentifier ===
                                    container.identifier
                                ) {
                                    addRelationship(
                                        person.identifier,
                                        container.identifier,
                                        relationship.description
                                    );

                                    if (implied) {
                                        addRelationship(
                                            person.identifier,
                                            system.identifier,
                                            relationship.description
                                        );
                                    }
                                }

                                container.groups
                                    .flatMap((x) => x.components)
                                    .concat(container.components)
                                    .forEach((component) => {
                                        if (
                                            relationship.targetIdentifier ===
                                            component.identifier
                                        ) {
                                            addRelationship(
                                                person.identifier,
                                                component.identifier,
                                                relationship.description
                                            );

                                            if (implied) {
                                                addRelationship(
                                                    person.identifier,
                                                    container.identifier,
                                                    relationship.description
                                                );
                                                addRelationship(
                                                    person.identifier,
                                                    system.identifier,
                                                    relationship.description
                                                );
                                            }
                                        }
                                    });
                            });
                    });
            });
        });

    return relationships;
};
