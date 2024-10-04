import {
    IContainer,
    IContainerView,
    IModel,
    IPerson,
    ISoftwareSystem,
} from "../../interfaces";
import { IDiagramVisitor, ISupportVisitor } from "../../shared";
import {
    isElementExplicitlyIncludedInView,
    visitImpliedRelationships,
    isRelationshipBetweenElementsInView,
    isRelationshipInWorkspace,
} from "../../utils";

export class ContainerViewStrategy
    implements
        ISupportVisitor<ISoftwareSystem, IContainer, ISoftwareSystem | IPerson>
{
    constructor(
        private model: IModel,
        private view: IContainerView
    ) {}

    accept(
        visitor: IDiagramVisitor<
            ISoftwareSystem,
            IContainer,
            ISoftwareSystem | IPerson
        >
    ): void {
        const visitedElements = new Set<string>();
        const relationships = visitImpliedRelationships(this.model);
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
                    (softwareSystem) =>
                        softwareSystem.identifier !==
                        this.view.softwareSystemIdentifier
                )
                .filter(
                    (softwareSystem) =>
                        isRelationshipInWorkspace(
                            relationships,
                            container.identifier,
                            softwareSystem.identifier
                        ) ||
                        isElementExplicitlyIncludedInView(
                            this.view,
                            softwareSystem.identifier
                        )
                )
                .filter(
                    (softwareSystem) =>
                        !visitedElements.has(softwareSystem.identifier)
                )
                .forEach((softwareSystem) => {
                    visitedElements.add(softwareSystem.identifier);
                    visitor.visitSupportingElement(softwareSystem);
                });
        };

        // 3.1.2. include all people that are directly connected to the current container
        const visitConnectedPeople = (container: IContainer) => {
            people
                .filter(
                    (person) =>
                        isRelationshipInWorkspace(
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
                    visitedElements.add(person.identifier);
                    visitor.visitSupportingElement(person);
                });
        };

        // 3.1. iterate over all containers and include them
        const visitContainerArray = (containers: Array<IContainer>) => {
            containers.forEach((container) => {
                visitedElements.add(container.identifier);
                visitor.visitPrimaryElement(container);
            });
        };

        // 2.1. iterate over all software systems and find software system for the view
        softwareSystems
            .filter(
                (softwareSystem) =>
                    softwareSystem.identifier ===
                    this.view.softwareSystemIdentifier
            )
            .flatMap((softwareSystem) => {
                const containers = softwareSystem.groups
                    .flatMap((x) => x.containers)
                    .concat(softwareSystem.containers);

                // 2.1.2.2 include all containers in the group and the group itself
                softwareSystem.groups.forEach((group) => {
                    visitedElements.add(group.identifier);
                    visitContainerArray(group.containers);
                    // visitor.visitGroup(group);
                });

                // 2.1.3. include all containers in the software system
                visitContainerArray(softwareSystem.containers);

                containers.forEach(visitConnectedPeople);
                containers.forEach(visitConnectedSoftwareSystems);

                // 2.1.1. include the software system as a boundary element
                visitedElements.add(softwareSystem.identifier);
                visitor.visitorScopeElement(softwareSystem);
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
                isRelationshipBetweenElementsInView(
                    visitedElements,
                    relationship
                )
            )
            .forEach((relationship) => visitor.visitRelationship(relationship));
    }
}
