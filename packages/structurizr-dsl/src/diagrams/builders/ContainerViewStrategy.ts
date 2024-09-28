import { IContainer, IContainerView, IModel } from "../../interfaces";
import { IElementVisitor, ISupportVisitor } from "../../shared";
import {
    elementIncludedInView,
    getRelationships,
    relationshipExistsForElementsInView,
    relationshipExistsOverall,
} from "../../utils";

export class ContainerViewStrategy implements ISupportVisitor {
    constructor(
        private model: IModel,
        private view: IContainerView
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

        // 3.1.3. include all software systems that are directly connected to the current container
        const visitConnectedSoftwareSystems = (container: IContainer) => {
            return softwareSystems
                .filter(
                    (softwareSystem) =>
                        softwareSystem.identifier !==
                        this.view.softwareSystemIdentifier
                )
                .filter((softwareSystem) => {
                    return (
                        relationshipExistsOverall(
                            relationships,
                            container.identifier,
                            softwareSystem.identifier
                        ) ||
                        elementIncludedInView(
                            this.view,
                            softwareSystem.identifier
                        )
                    );
                })
                .filter(
                    (softwareSystem) =>
                        !visitedElements.has(softwareSystem.identifier)
                )
                .map((softwareSystem) => {
                    visitedElements.add(softwareSystem.identifier);
                    return visitor.visitSoftwareSystem(softwareSystem);
                });
        };

        // 3.1.2. include all people that are directly connected to the current container
        const visitConnectedPeople = (container: IContainer) => {
            return people
                .filter((person) => {
                    return (
                        relationshipExistsOverall(
                            relationships,
                            container.identifier,
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

        // 3.1. iterate over all containers and include them
        const visitContainerArray = (
            containers: Array<IContainer>,
            parentId?: string
        ) => {
            return containers.map((container) => {
                visitedElements.add(container.identifier);
                return visitor.visitContainer(container, { parentId });
            });
        };

        // 2.1. iterate over all software systems and find software system for the view
        const visitedSoftwareSystem = softwareSystems
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
                const visitedGroups = softwareSystem.groups.map((group) => {
                    visitedElements.add(group.identifier);
                    const visitedContainers = visitContainerArray(
                        group.containers,
                        group.identifier
                    );
                    return visitor.visitGroup(group, {
                        parentId: softwareSystem.identifier,
                        children: visitedContainers,
                    });
                });

                // 2.1.3. include all containers in the software system
                const visitedContainers = visitContainerArray(
                    softwareSystem.containers,
                    softwareSystem.identifier
                );

                const visitedConnectedPeople =
                    containers.flatMap(visitConnectedPeople);
                const visitedConnectedSoftwareSystems = containers.flatMap(
                    visitConnectedSoftwareSystems
                );

                // 2.1.1. include the software system as a boundary element
                visitedElements.add(softwareSystem.identifier);
                const visitedSoftwareSystem = visitor.visitSoftwareSystem(
                    softwareSystem,
                    {
                        children: visitedGroups.concat(visitedContainers),
                    }
                );

                return [visitedSoftwareSystem]
                    .concat(visitedConnectedSoftwareSystems)
                    .concat(visitedConnectedPeople);
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

        return visitedSoftwareSystem.concat(visitedRelationships);
    }
}
