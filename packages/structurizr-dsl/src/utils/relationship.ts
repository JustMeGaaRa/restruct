import {
    IComponent,
    IContainer,
    IModel,
    IPerson,
    IRelationship,
    ISoftwareSystem,
} from "../interfaces";
import { Relationship } from "../models";

export type Element = IPerson | ISoftwareSystem | IContainer | IComponent;
export type ElementArray = Array<Element>;

export const visitWorkspaceHierarchy = (model: IModel): ElementArray => {
    return [
        ...model.groups.flatMap((group) => group.people).concat(model.people),
        ...model.groups
            .flatMap((group) => group.softwareSystems)
            .concat(model.softwareSystems)
            .flatMap((softwareSystem) => {
                return [
                    softwareSystem,
                    ...softwareSystem.groups
                        .flatMap((x) => x.containers)
                        .concat(softwareSystem.containers)
                        .flatMap((container) => {
                            return [
                                container,
                                ...container.groups
                                    .flatMap((x) => x.components)
                                    .concat(container.components),
                            ];
                        }),
                ];
            }),
    ];
};

export const visitWorkspaceRelationships = (
    model: IModel
): Array<IRelationship> => {
    return [
        ...model.relationships,
        ...model.groups
            .flatMap((group) => group.softwareSystems)
            .concat(model.softwareSystems)
            .flatMap((softwareSystem) => {
                return [
                    ...softwareSystem.relationships,
                    ...softwareSystem.groups
                        .flatMap((x) => x.containers)
                        .concat(softwareSystem.containers)
                        .flatMap((container) => {
                            return [
                                ...container.relationships,
                                ...container.groups
                                    .flatMap((x) => x.components)
                                    .concat(container.components)
                                    .flatMap((component) => {
                                        return component.relationships;
                                    }),
                            ];
                        }),
                ];
            }),
    ];
};

export const getElementMap = (elements: ElementArray) => {
    const elementBag = new Map<string, Element>(
        elements.map((element) => [element.identifier, element])
    );
    return elementBag;
};

export const getRelationshipMap = (relationships: Array<IRelationship>) => {
    const relationshipMap = new Map<string, IRelationship>(
        relationships.map((relationship) => [
            relationship.identifier,
            relationship,
        ])
    );
    return relationshipMap;
};

export const getElementParentMap = (model: IModel) => {
    const elementTree = new Map<string, string | undefined>();

    model.groups
        .flatMap((group) => group.softwareSystems)
        .concat(model.softwareSystems)
        .forEach((softwareSystem) => {
            elementTree.set(softwareSystem.identifier, undefined);

            softwareSystem.groups
                .flatMap((group) => group.containers)
                .concat(softwareSystem.containers)
                .forEach((container) => {
                    elementTree.set(
                        container.identifier,
                        softwareSystem.identifier
                    );

                    container.groups
                        .flatMap((group) => group.components)
                        .concat(container.components)
                        .forEach((component) => {
                            elementTree.set(
                                component.identifier,
                                container.identifier
                            );
                        });
                });
        });

    model.groups
        .flatMap((group) => group.people)
        .concat(model.people)
        .forEach((person) => {
            elementTree.set(person.identifier, undefined);
        });

    return elementTree;
};

export const isRelationshipSame = (
    relationship: IRelationship,
    sourceIdentifier: string,
    targetIdentifier: string
) => {
    return (
        (relationship.sourceIdentifier === sourceIdentifier &&
            relationship.targetIdentifier === targetIdentifier) ||
        (relationship.sourceIdentifier === targetIdentifier &&
            relationship.targetIdentifier === sourceIdentifier)
    );
};

export const doesRelationshipExist = (
    relationships: IRelationship[],
    sourceIdentifier: string,
    targetIdentifier: string
) => {
    return relationships.some((relationship) =>
        isRelationshipSame(relationship, sourceIdentifier, targetIdentifier)
    );
};

export const creteImpliedRelationship = (
    elementIdentifier: string,
    elementParentIdentifier: string,
    originalRelationship: IRelationship,
    impliedRelationships: Map<string, IRelationship>
) => {
    const isElementSource =
        originalRelationship.sourceIdentifier === elementIdentifier;
    const sourceIdentifier = isElementSource
        ? elementParentIdentifier
        : originalRelationship.sourceIdentifier;
    const targetIdentifier = isElementSource
        ? originalRelationship.targetIdentifier
        : elementParentIdentifier;

    const impliedRelationship = new Relationship({
        sourceIdentifier: sourceIdentifier,
        targetIdentifier: targetIdentifier,
        description: originalRelationship.description,
    }).toSnapshot();

    if (!impliedRelationships.has(impliedRelationship.identifier)) {
        impliedRelationships.set(
            impliedRelationship.identifier,
            impliedRelationship
        );
    }
};

export const getImpliedRelationshipsForSystemLandscapeView = (
    model: IModel
) => {
    const relationships = visitWorkspaceRelationships(model);
    const people = model.groups
        .flatMap((group) => group.people)
        .concat(model.people);
    const softwareSystems = model.groups
        .flatMap((group) => group.softwareSystems)
        .concat(model.softwareSystems);

    const impliedRelationships = getRelationshipMap(relationships);

    // RESTRICTION: System Context View only allows realtionships from:
    // - Software System --> Person
    // - Software System <-- Person
    // - Software System --> Software System
    softwareSystems.forEach((softwareSystem) => {
        // filter out the current software system to avoid self-referencing
        const otherSoftwareSystems = softwareSystems.filter(
            (x) => x.identifier !== softwareSystem.identifier
        );
        const externalSystemsOrPeople = [...otherSoftwareSystems, ...people];

        const childContainers = softwareSystem.groups
            .flatMap((group) => group.containers)
            .concat(softwareSystem.containers);

        childContainers.forEach((container) => {
            const childComponents = container.groups
                .flatMap((group) => group.components)
                .concat(container.components);

            childComponents.forEach((component) => {
                // CASE: Check if any Components have explicit relationship with any Software System or Person
                // and create an implied relationship from this Software System to the Software System or Person
                filterRelationshipsBetweenElements(
                    relationships,
                    component,
                    externalSystemsOrPeople
                ).forEach((relationship) => {
                    creteImpliedRelationship(
                        component.identifier,
                        softwareSystem.identifier,
                        relationship,
                        impliedRelationships
                    );
                });
            });

            // CASE: Check if any Containers have explicit relationship with any Software System or Person
            // and create an implied relationship from this Software System to the Software System or Person
            filterRelationshipsBetweenElements(
                relationships,
                container,
                externalSystemsOrPeople
            ).forEach((relationship) => {
                creteImpliedRelationship(
                    container.identifier,
                    softwareSystem.identifier,
                    relationship,
                    impliedRelationships
                );
            });
        });
    });

    return [...impliedRelationships.values()];
};

export const getImpliedRelationshipsForSystemContextView = (
    model: IModel,
    softwareSystemIdentifier: string
) => {
    const relationships = visitWorkspaceRelationships(model);
    const people = model.groups
        .flatMap((group) => group.people)
        .concat(model.people);
    const softwareSystems = model.groups
        .flatMap((group) => group.softwareSystems)
        .concat(model.softwareSystems);

    const impliedRelationships = getRelationshipMap(relationships);

    // RESTRICTION: System Context View only allows realtionships from:
    // - Software System --> Person
    // - Software System <-- Person
    // - Software System --> Software System
    softwareSystems
        .filter((x) => x.identifier === softwareSystemIdentifier)
        .forEach((softwareSystemScope) => {
            // filter out the current software system to avoid self-referencing
            const otherSoftwareSystems = softwareSystems.filter(
                (x) => x.identifier !== softwareSystemScope.identifier
            );
            const externalSystemsOrPeople = [
                ...otherSoftwareSystems,
                ...people,
            ];

            const childContainers = softwareSystemScope.groups
                .flatMap((group) => group.containers)
                .concat(softwareSystemScope.containers);

            childContainers.forEach((container) => {
                const childComponents = container.groups
                    .flatMap((group) => group.components)
                    .concat(container.components);

                childComponents.forEach((component) => {
                    // CASE: Check if any Components have explicit relationship with any Software System or Person
                    // and create an implied relationship from this Software System to the Software System or Person
                    filterRelationshipsBetweenElements(
                        relationships,
                        component,
                        externalSystemsOrPeople
                    ).forEach((relationship) => {
                        creteImpliedRelationship(
                            component.identifier,
                            softwareSystemScope.identifier,
                            relationship,
                            impliedRelationships
                        );
                    });
                });

                // CASE: Check if any Containers have explicit relationship with any Software System or Person
                // and create an implied relationship from this Software System to the Software System or Person
                filterRelationshipsBetweenElements(
                    relationships,
                    container,
                    externalSystemsOrPeople
                ).forEach((relationship) => {
                    creteImpliedRelationship(
                        container.identifier,
                        softwareSystemScope.identifier,
                        relationship,
                        impliedRelationships
                    );
                });
            });
        });

    return [...impliedRelationships.values()];
};

export const getImpliedRelationshipsForContainerView = (
    model: IModel,
    softwareSystemIdentifier: string
) => {
    const relationships = visitWorkspaceRelationships(model);
    const people = model.groups
        .flatMap((group) => group.people)
        .concat(model.people);
    const softwareSystems = model.groups
        .flatMap((group) => group.softwareSystems)
        .concat(model.softwareSystems);

    const impliedRelationships = getRelationshipMap(relationships);

    // RESTRICTION: Container View only allows realtionships from:
    // - Container --> Person | Software System
    // - Container <-- Person | Software System
    // - Container --> Container (in the same scope)
    softwareSystems
        .filter((x) => x.identifier === softwareSystemIdentifier)
        .forEach((softwareSystemScope) => {
            // filter out the current software system to avoid self-referencing
            const otherSoftwareSystems = softwareSystems.filter(
                (x) => x.identifier !== softwareSystemScope.identifier
            );
            const externalSystemsOrPeople = [
                ...otherSoftwareSystems,
                ...people,
            ];

            const childContainers = softwareSystemScope.groups
                .flatMap((group) => group.containers)
                .concat(softwareSystemScope.containers);

            childContainers.forEach((container) => {
                const childComponents = container.groups
                    .flatMap((group) => group.components)
                    .concat(container.components);

                childComponents.forEach((component) => {
                    // CASE: Check if any Components have explicit relationship with any Software System or Person
                    // and create an implied relationship from this Container to the Software System or Person
                    filterRelationshipsBetweenElements(
                        relationships,
                        component,
                        externalSystemsOrPeople
                    ).forEach((relationship) => {
                        creteImpliedRelationship(
                            component.identifier,
                            container.identifier,
                            relationship,
                            impliedRelationships
                        );
                    });

                    const otherScopeContainers = childContainers.filter(
                        (x) => x.identifier !== container.identifier
                    );
                    // CASE: Check if any Components have explicit relationship with other Containers in the scope
                    // and create an implied relationship from this Container to the other Container
                    filterRelationshipsBetweenElements(
                        relationships,
                        component,
                        otherScopeContainers
                    ).forEach((relationship) => {
                        creteImpliedRelationship(
                            component.identifier,
                            container.identifier,
                            relationship,
                            impliedRelationships
                        );
                    });
                });
            });
        });

    return [...impliedRelationships.values()];
};

export const filterRelationshipsBetweenElements = (
    relationships: Array<IRelationship>,
    currentElement: IContainer | IComponent,
    externalElements: Array<ISoftwareSystem | IContainer | IPerson>
) => {
    return relationships.filter((relationship) =>
        externalElements.some((targetElement) =>
            isRelationshipSame(
                relationship,
                currentElement.identifier,
                targetElement.identifier
            )
        )
    );
};
