import {
    IModel,
    IPerson,
    ISoftwareSystem,
    ISystemContextView,
} from "../../interfaces";
import { IDiagramVisitor, ISupportVisitor } from "../../shared";
import {
    elementIncludedInView,
    getRelationships,
    relationshipExistsForElementsInView,
    relationshipExistsOverall,
} from "../../utils";

export class SystemContextViewStrategy
    implements
        ISupportVisitor<unknown, ISoftwareSystem, ISoftwareSystem | IPerson>
{
    constructor(
        private model: IModel,
        private view: ISystemContextView
    ) {}

    accept(
        visitor: IDiagramVisitor<
            unknown,
            ISoftwareSystem,
            ISoftwareSystem | IPerson
        >
    ): void {
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
            softwareSystems
                .filter(
                    (softwareSystem) =>
                        softwareSystem.identifier !==
                        this.view.softwareSystemIdentifier
                )
                .filter(
                    (otherSoftwareSystem) =>
                        relationshipExistsOverall(
                            relationships,
                            softwareSystem.identifier,
                            otherSoftwareSystem.identifier
                        ) ||
                        elementIncludedInView(
                            this.view,
                            otherSoftwareSystem.identifier
                        )
                )
                .forEach((softwareSystem) => {
                    visitedElements.add(softwareSystem.identifier);
                    visitor.visitSupportingElement(softwareSystem);
                });
        };

        // 2.1.2. include all people that are directly connected to the current software system
        const visitConnectedPeople = (softwareSystem: ISoftwareSystem) => {
            people
                .filter(
                    (person) =>
                        relationshipExistsOverall(
                            relationships,
                            softwareSystem.identifier,
                            person.identifier
                        ) || elementIncludedInView(this.view, person.identifier)
                )
                .filter((person) => !visitedElements.has(person.identifier))
                .forEach((person) => {
                    visitedElements.add(person.identifier);
                    visitor.visitSupportingElement(person);
                });
        };

        softwareSystems
            .filter(
                (softwareSystem) =>
                    softwareSystem.identifier ===
                    this.view.softwareSystemIdentifier
            )
            .forEach((softwareSystem) => {
                // 2.1.1. include the current software and all software systems
                visitedElements.add(softwareSystem.identifier);
                visitor.visitPrimaryElement(softwareSystem);

                visitConnectedPeople(softwareSystem);
                visitConnectedSoftwareSystems(softwareSystem);
            });

        relationships
            .filter(
                (relationship) =>
                    relationship.sourceIdentifier !==
                        this.view.softwareSystemIdentifier &&
                    relationship.targetIdentifier !==
                        this.view.softwareSystemIdentifier
            )
            .filter((relationship) =>
                relationshipExistsForElementsInView(
                    Array.from(visitedElements),
                    relationship
                )
            )
            .forEach((relationship) => visitor.visitRelationship(relationship));
    }
}
