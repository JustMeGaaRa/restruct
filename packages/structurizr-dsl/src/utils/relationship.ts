import {
    IComponent,
    IContainer,
    IPerson,
    IRelationship,
    ISoftwareSystem,
} from "../interfaces";
import { Relationship } from "../models";

export type Element = IPerson | ISoftwareSystem | IContainer | IComponent;
export type ElementArray = Array<Element>;

export const createRelationship = (
    sourceIdentifier: string,
    targetIdentifier: string,
    description?: string
) => {
    return new Relationship({
        sourceIdentifier,
        targetIdentifier,
        description,
    }).toSnapshot();
};

export const isRelationshipEqual = (
    first: IRelationship,
    second: IRelationship
) => {
    return (
        (first.sourceIdentifier === second.sourceIdentifier &&
            first.targetIdentifier === second.targetIdentifier) ||
        (first.sourceIdentifier === second.targetIdentifier &&
            first.targetIdentifier === second.sourceIdentifier)
    );
};

export const isRelationshipInView = (
    elementsInView: Set<string> | Map<string, string>,
    relationship: IRelationship
) => {
    return (
        elementsInView.has(relationship.sourceIdentifier) &&
        elementsInView.has(relationship.targetIdentifier)
    );
};

export const anyRelationshipEquals = (
    existingRelationships: IRelationship[],
    sourceIdentifier: string,
    targetIdentifier: string
) => {
    const targetRelationship = createRelationship(
        sourceIdentifier,
        targetIdentifier
    );
    return existingRelationships.some((existingRelationship) =>
        isRelationshipEqual(existingRelationship, targetRelationship)
    );
};

export const filterRelationshipsBetweenElements = (
    relationships: Array<IRelationship>,
    currentElement: IContainer | IComponent,
    externalElements: Array<ISoftwareSystem | IContainer | IPerson>
) => {
    return relationships.filter((existingRelationship) =>
        externalElements.some((targetElement) => {
            const targetRelationship = createRelationship(
                currentElement.identifier,
                targetElement.identifier
            );
            return isRelationshipEqual(
                existingRelationship,
                targetRelationship
            );
        })
    );
};
