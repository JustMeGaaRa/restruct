import {
    IComponent,
    IContainer,
    IContainerView,
    IModel,
    IPerson,
    IRelationship,
    ISoftwareSystem,
    ISystemContextView,
    ISystemLandscapeView,
    ViewType,
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

export const getImpliedRelationships = (
    model: IModel,
    view?: ISystemLandscapeView | ISystemContextView | IContainerView
) => {
    const relationships = visitWorkspaceRelationships(model);
    const people = model.groups
        .flatMap((group) => group.people)
        .concat(model.people);
    const softwareSystems = model.groups
        .flatMap((group) => group.softwareSystems)
        .concat(model.softwareSystems);

    const isSystemLandscapeView = view?.type === ViewType.SystemLandscape;
    const isSystemContextView = view?.type === ViewType.SystemContext;
    const isContainerView = view?.type === ViewType.Container;

    const impliedRelationships = getRelationshipMap(relationships);

    // RESTRICTION: System Landscape and System Context views only allow realtionships from:
    // - Software System --> Person
    // - Software System <-- Person
    // - Software System --> Software System
    // RESTRICTION: Container View only allows realtionships from:
    // - Container --> Person | Software System
    // - Container <-- Person | Software System
    // - Container --> Container (in the same scope)
    const softwareSystemsInScope =
        isSystemContextView || isContainerView
            ? softwareSystems.filter(
                  (x) => x.identifier === view.softwareSystemIdentifier
              )
            : softwareSystems;

    softwareSystemsInScope.forEach((softwareSystemScope) => {
        // filter out the current software system to avoid self-referencing
        const otherSoftwareSystems = softwareSystems.filter(
            (x) => x.identifier !== softwareSystemScope.identifier
        );
        const externalSystemsOrPeople = [...otherSoftwareSystems, ...people];

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
                        isContainerView
                            ? container.identifier
                            : softwareSystemScope.identifier,
                        relationship,
                        impliedRelationships
                    );
                });

                if (isContainerView) {
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
                }
            });

            if (isSystemLandscapeView || isSystemContextView) {
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
            }
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
