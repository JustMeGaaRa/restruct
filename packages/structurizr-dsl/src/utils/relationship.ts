import {
    IComponent,
    IContainer,
    IModel,
    IPerson,
    IRelationship,
    ISoftwareSystem,
} from "../interfaces";
import { Relationship } from "../models";
import { isComponent, isContainer } from "./guards";

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

export const cacheElements = (elements: ElementArray) => {
    const elementBag = new Map<string, Element>();
    elements.forEach((element) => {
        elementBag.set(element.identifier, element);
    });
    return elementBag;
};

export const cacheRelationships = (relationships: Array<IRelationship>) => {
    const relationshipBag = new Map<string, IRelationship>();
    relationships.forEach((relationship) => {
        relationshipBag.set(relationship.identifier, relationship);
    });
    return relationshipBag;
};

export const getElementTree = (model: IModel) => {
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

export const getSourceElements = (relationships: Array<IRelationship>) => {
    const sourceElementBag = new Set<string>(
        relationships.map((relationship) => relationship.sourceIdentifier)
    );
    return sourceElementBag;
};

export const getTargetElements = (relationships: Array<IRelationship>) => {
    const targetElementBag = new Set<string>(
        relationships.map((relationship) => relationship.targetIdentifier)
    );
    return targetElementBag;
};

export const isRelationshipInWorkspace = (
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

export const visitImpliedRelationships = (
    model: IModel
): Array<IRelationship> => {
    const elements = visitWorkspaceHierarchy(model);
    const relationships = visitWorkspaceRelationships(model);
    const elementBag = cacheElements(elements);
    const elementTree = getElementTree(model);

    // TODO: optimize performance by caching the relationships
    // TODO: exclude implied relationships from child to it's own parent
    return relationships.flatMap((relationship) => {
        const impliedRelationships = Array.from<IRelationship>([relationship]);

        const elementWithIncomingRelationship = elementBag.get(
            relationship.targetIdentifier
        );

        if (isComponent(elementWithIncomingRelationship)) {
            const parentContainerIdentifier = elementTree.get(
                elementWithIncomingRelationship?.identifier ?? ""
            );

            if (parentContainerIdentifier) {
                const containerImpliedRelationship = new Relationship({
                    sourceIdentifier: relationship.sourceIdentifier,
                    targetIdentifier: parentContainerIdentifier,
                    description: relationship.description,
                }).toSnapshot();

                if (
                    !isRelationshipInWorkspace(
                        relationships,
                        relationship.sourceIdentifier,
                        parentContainerIdentifier
                    )
                ) {
                    impliedRelationships.push(containerImpliedRelationship);
                }

                const parentSoftwareSystemIdentifier = elementTree.get(
                    parentContainerIdentifier ?? ""
                );

                if (parentSoftwareSystemIdentifier) {
                    const softwareSystemImpliedRelationship = new Relationship({
                        sourceIdentifier: relationship.sourceIdentifier,
                        targetIdentifier: parentSoftwareSystemIdentifier,
                        description: relationship.description,
                    }).toSnapshot();

                    if (
                        !isRelationshipInWorkspace(
                            relationships,
                            relationship.sourceIdentifier,
                            parentSoftwareSystemIdentifier
                        )
                    ) {
                        impliedRelationships.push(
                            softwareSystemImpliedRelationship
                        );
                    }
                }
            }
        }

        if (isContainer(elementWithIncomingRelationship)) {
            const parentSoftwareSystemIdentifier = elementTree.get(
                elementWithIncomingRelationship?.identifier ?? ""
            );

            if (parentSoftwareSystemIdentifier) {
                const softwareSystemImpliedRelationship = new Relationship({
                    sourceIdentifier: relationship.sourceIdentifier,
                    targetIdentifier: parentSoftwareSystemIdentifier,
                    description: relationship.description,
                }).toSnapshot();

                if (
                    !isRelationshipInWorkspace(
                        relationships,
                        relationship.sourceIdentifier,
                        parentSoftwareSystemIdentifier
                    )
                ) {
                    impliedRelationships.push(
                        softwareSystemImpliedRelationship
                    );
                }
            }
        }

        return impliedRelationships;
    });
};
