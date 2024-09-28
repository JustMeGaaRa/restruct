import { IModel, ISoftwareSystem, ISystemContextView } from "../../interfaces";
import { IElementVisitor, ISupportVisitor } from "../../shared";
import {
    elementIncludedInView,
    getRelationships,
    relationshipExistsForElementsInView,
    relationshipExistsOverall,
} from "../../utils";

export class SystemContextViewStrategy implements ISupportVisitor {
    constructor(
        private model: IModel,
        private view: ISystemContextView
    ) {}

    accept<T>(visitor: IElementVisitor<T>): Array<T> {
        const visitedElements = new Set<string>();
        const relationships = getRelationships(this.model, false);
        const people = this.model.groups
            .flatMap((x) => x.people)
            .concat(this.model.people);
        const softwareSystems = this.model.groups
            .flatMap((x) => x.softwareSystems)
            .concat(this.model.softwareSystems);

        // 2.1.3. include all software systems that are directly connected to the current container
        const visitConnectedSoftwareSystems = (
            softwareSystem: ISoftwareSystem
        ) => {
            return softwareSystems
                .filter(
                    (softwareSystem) =>
                        softwareSystem.identifier !==
                        this.view.softwareSystemIdentifier
                )
                .filter((otherSoftwareSystem) => {
                    return (
                        relationshipExistsOverall(
                            relationships,
                            softwareSystem.identifier,
                            otherSoftwareSystem.identifier
                        ) ||
                        elementIncludedInView(
                            this.view,
                            otherSoftwareSystem.identifier
                        )
                    );
                })
                .map((softwareSystem) => {
                    visitedElements.add(softwareSystem.identifier);
                    return visitor.visitSoftwareSystem(softwareSystem);
                });
        };

        // 2.1.2. include all people that are directly connected to the current software system
        const visitConnectedPeople = (softwareSystem: ISoftwareSystem) => {
            return people
                .filter((person) => {
                    return (
                        relationshipExistsOverall(
                            relationships,
                            softwareSystem.identifier,
                            person.identifier
                        ) || elementIncludedInView(this.view, person.identifier)
                    );
                })
                .filter((person) => !visitedElements.has(person.identifier))
                .map((person) => {
                    visitedElements.add(person.identifier);
                    return visitor.visitPerson(person);
                });
        };

        const visitedSoftwareSystems = softwareSystems
            .filter(
                (softwareSystem) =>
                    softwareSystem.identifier ===
                    this.view.softwareSystemIdentifier
            )
            .flatMap((softwareSystem) => {
                const visitedConnectedPeople =
                    visitConnectedPeople(softwareSystem);
                const visitedConnectedSoftwareSystems =
                    visitConnectedSoftwareSystems(softwareSystem);

                // 2.1.1. include the current software and all software systems
                visitedElements.add(softwareSystem.identifier);
                const visitedSoftwareSystem =
                    visitor.visitSoftwareSystem(softwareSystem);

                return [visitedSoftwareSystem]
                    .concat(visitedConnectedPeople)
                    .concat(visitedConnectedSoftwareSystems);
            });

        const visitedRelationships = relationships
            .filter(
                (relationship) =>
                    relationship.sourceIdentifier !==
                    this.view.softwareSystemIdentifier
            )
            .filter(
                (relationship) =>
                    relationship.targetIdentifier !==
                    this.view.softwareSystemIdentifier
            )
            .filter((relationship) =>
                relationshipExistsForElementsInView(
                    Array.from(visitedElements),
                    relationship
                )
            )
            .map((relationship) => visitor.visitRelationship(relationship));

        return visitedSoftwareSystems.concat(visitedRelationships);
    }
}
