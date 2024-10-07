import {
    IContainer,
    IContainerView,
    IGroup,
    IModel,
    IPerson,
    IRelationship,
    ISoftwareSystem,
} from "../../interfaces";
import { IDiagramVisitor, ISupportVisitor } from "../../shared";
import {
    isElementExplicitlyIncludedInView,
    isRelationshipBetweenElementsInView,
    doesRelationshipExist,
    getImpliedRelationshipsForContainerView,
} from "../../utils";

export class ContainerViewStrategy
    implements
        ISupportVisitor<
            ISoftwareSystem,
            IGroup | IContainer,
            ISoftwareSystem | IPerson
        >
{
    constructor(
        private model: IModel,
        private view: IContainerView
    ) {}

    accept(
        visitor: IDiagramVisitor<
            ISoftwareSystem,
            IGroup | IContainer,
            ISoftwareSystem | IPerson
        >
    ): void {
        const visitedElements = new Map<string, string>();
        const relationships = getImpliedRelationshipsForContainerView(
            this.model,
            this.view.softwareSystemIdentifier
        );
        const people = this.model.groups
            .flatMap((x) => x.people)
            .concat(this.model.people);
        const softwareSystems = this.model.groups
            .flatMap((x) => x.softwareSystems)
            .concat(this.model.softwareSystems);

        // 3.1.3. include all software systems that are directly connected to the current container
        const visitConnectedSoftwareSystems = (container: IContainer) => {
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
                            container.identifier,
                            otherSoftwareSystem.identifier
                        ) ||
                        isElementExplicitlyIncludedInView(
                            this.view,
                            otherSoftwareSystem.identifier
                        )
                )
                .filter(
                    (softwareSystem) =>
                        !visitedElements.has(softwareSystem.identifier)
                )
                .forEach((softwareSystem) => {
                    visitedElements.set(
                        softwareSystem.identifier,
                        softwareSystem.name
                    );
                    visitor.visitSupportingElement(softwareSystem);
                });
        };

        // 3.1.2. include all people that are directly connected to the current container
        const visitConnectedPeople = (container: IContainer) => {
            people
                .filter(
                    (person) =>
                        doesRelationshipExist(
                            relationships,
                            container.identifier,
                            person.identifier
                        ) ||
                        isElementExplicitlyIncludedInView(
                            this.view,
                            person.identifier
                        )
                )
                .filter((person) => !visitedElements.has(person.identifier))
                .forEach((person) => {
                    visitedElements.set(person.identifier, person.name);
                    visitor.visitSupportingElement(person);
                });
        };

        const visitContainerArray = (containers: Array<IContainer>) => {
            containers.forEach((container) => {
                visitedElements.set(container.identifier, container.name);
                visitor.visitPrimaryElement(container);

                visitConnectedPeople(container);
                visitConnectedSoftwareSystems(container);
            });
        };

        const visitSoftwareSystemInScope = () => {
            softwareSystems
                .filter(
                    (softwareSystem) =>
                        softwareSystem.identifier ===
                        this.view.softwareSystemIdentifier
                )
                .flatMap((softwareSystem) => {
                    visitedElements.set(
                        softwareSystem.identifier,
                        softwareSystem.name
                    );
                    visitor.visitorScopeElement(softwareSystem);

                    softwareSystem.groups.forEach((group) => {
                        visitedElements.set(group.identifier, group.name);
                        visitor.visitPrimaryElement(group);

                        visitContainerArray(group.containers);
                    });

                    visitContainerArray(softwareSystem.containers);
                });
        };

        const isRelationshipWithScope = (relationship: IRelationship) => {
            return (
                relationship.sourceIdentifier ===
                    this.view.softwareSystemIdentifier ||
                relationship.targetIdentifier ===
                    this.view.softwareSystemIdentifier
            );
        };

        const visitRelationshipArray = (
            relationships: Array<IRelationship>
        ) => {
            const filtered = relationships.filter(
                (relationship) =>
                    !isRelationshipWithScope(relationship) &&
                    isRelationshipBetweenElementsInView(
                        visitedElements,
                        relationship
                    )
            );
            filtered.forEach((relationship) =>
                visitor.visitRelationship(relationship)
            );
        };

        visitSoftwareSystemInScope();
        visitRelationshipArray(relationships);
    }
}
