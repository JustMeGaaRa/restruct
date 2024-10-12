import {
    IModel,
    IPerson,
    IRelationship,
    ISoftwareSystem,
    ISystemContextView,
} from "../../interfaces";
import { IDiagramVisitor, ISupportVisitor } from "../../shared";
import {
    isElementExplicitlyIncludedInView,
    isRelationshipBetweenElementsInView,
    doesRelationshipExist,
    getImpliedRelationships,
} from "../../utils";

export class SystemContextViewStrategy
    implements
        ISupportVisitor<ISoftwareSystem, ISoftwareSystem | IPerson, unknown>
{
    constructor(
        private model: IModel,
        private view: ISystemContextView
    ) {}

    accept(
        visitor: IDiagramVisitor<
            ISoftwareSystem,
            ISoftwareSystem | IPerson,
            unknown
        >
    ): void {
        const visitedElements = new Set<string>();
        const relationships = getImpliedRelationships(this.model, this.view);
        const people = this.model.groups
            .flatMap((group) => group.people)
            .concat(this.model.people);
        const softwareSystems = this.model.groups
            .flatMap((group) => group.softwareSystems)
            .concat(this.model.softwareSystems);

        const visitConnectedSoftwareSystems = (
            softwareSystem: ISoftwareSystem
        ) => {
            softwareSystems
                .filter(
                    (otherSoftwareSystem) =>
                        otherSoftwareSystem.identifier !==
                        this.view.softwareSystemIdentifier
                )
                .filter(
                    (otherSoftwareSystem) =>
                        doesRelationshipExist(
                            relationships,
                            softwareSystem.identifier,
                            otherSoftwareSystem.identifier
                        ) ||
                        isElementExplicitlyIncludedInView(
                            this.view,
                            otherSoftwareSystem.identifier
                        )
                )
                .forEach((softwareSystem) => {
                    visitedElements.add(softwareSystem.identifier);
                    visitor.visitPrimaryElement?.(softwareSystem);
                });
        };

        const visitConnectedPeople = (softwareSystem: ISoftwareSystem) => {
            people
                .filter(
                    (person) =>
                        doesRelationshipExist(
                            relationships,
                            softwareSystem.identifier,
                            person.identifier
                        ) ||
                        isElementExplicitlyIncludedInView(
                            this.view,
                            person.identifier
                        )
                )
                .filter((person) => !visitedElements.has(person.identifier))
                .forEach((person) => {
                    visitedElements.add(person.identifier);
                    visitor.visitPrimaryElement?.(person);
                });
        };

        const visitSoftwareSystemInScope = () => {
            softwareSystems
                .filter(
                    (softwareSystem) =>
                        softwareSystem.identifier ===
                        this.view.softwareSystemIdentifier
                )
                .forEach((softwareSystem) => {
                    visitedElements.add(softwareSystem.identifier);
                    visitor.visitorScopeElement?.(softwareSystem);

                    visitConnectedPeople(softwareSystem);
                    visitConnectedSoftwareSystems(softwareSystem);
                });
        };

        const visitRelationshipArray = (
            relationships: Array<IRelationship>
        ) => {
            relationships
                .filter((relationship) =>
                    isRelationshipBetweenElementsInView(
                        visitedElements,
                        relationship
                    )
                )
                .forEach((relationship) =>
                    visitor.visitRelationship?.(relationship)
                );
        };

        visitSoftwareSystemInScope();
        visitRelationshipArray(relationships);
    }
}
