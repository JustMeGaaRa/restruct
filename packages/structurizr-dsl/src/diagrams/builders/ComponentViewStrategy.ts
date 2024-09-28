import { IComponent, IComponentView, IModel } from "../../interfaces";
import { IElementVisitor, ISupportVisitor } from "../../shared";
import {
    elementIncludedInView,
    getRelationships,
    relationshipExistsForElementsInView,
    relationshipExistsOverall,
} from "../../utils";

export class ComponentViewStrategy implements ISupportVisitor {
    constructor(
        private model: IModel,
        private view: IComponentView
    ) {}

    accept<T>(visitor: IElementVisitor<T>): Array<T> {
        const visitedElements = new Set<string>();
        const relationships = getRelationships(this.model, false);
        const people = this.model.people.concat(
            this.model.groups.flatMap((x) => x.people)
        );
        const softwareSystems = this.model.softwareSystems.concat(
            this.model.groups.flatMap((x) => x.softwareSystems)
        );
        const containers = softwareSystems
            .flatMap((x) => x.groups.flatMap((y) => y.containers))
            .concat(softwareSystems.flatMap((x) => x.containers));

        // 4.1.2. include all people that are directly connected to the current component
        const visitConnectedPeople = (component: IComponent) => {
            return people
                .filter((person) => {
                    return (
                        relationshipExistsOverall(
                            relationships,
                            component.identifier,
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

        // 4.1.3. include all software systems that are directly connected to the current component
        const visitConnectedSoftwareSystems = (component: IComponent) => {
            return softwareSystems
                .filter((softwareSystem) => {
                    return (
                        relationshipExistsOverall(
                            relationships,
                            component.identifier,
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

        // 4.1.4. include all containers that are directly connected to the current container
        const visitConnectedContainers = (component: IComponent) => {
            return containers
                .filter(
                    (container) =>
                        container.identifier !== this.view.containerIdentifier
                )
                .filter((container) => {
                    return (
                        relationshipExistsOverall(
                            relationships,
                            component.identifier,
                            container.identifier
                        ) ||
                        elementIncludedInView(this.view, container.identifier)
                    );
                })
                .filter(
                    (container) => !visitedElements.has(container.identifier)
                )
                .map((container) => {
                    visitedElements.add(container.identifier);
                    return visitor.visitContainer(container);
                });
        };

        // 4.1. iterate over all components and include them
        const visitComponentArray = (
            components: Array<IComponent>,
            parentId?: string
        ) => {
            return components.map((component) => {
                visitedElements.add(component.identifier);
                return visitor.visitComponent(component, { parentId });
            });
        };

        // 3.1. iterate over all containers to find the one for the view
        const visitedContainer = containers
            .filter(
                (container) =>
                    container.identifier === this.view.containerIdentifier
            )
            .flatMap((container) => {
                const components = container.groups
                    .flatMap((x) => x.components)
                    .concat(container.components);

                // 3.1.2. iterate over all groups in the container and the group itself
                const visitedGroups = container.groups.map((group) => {
                    visitedElements.add(group.identifier);
                    const visitedComponents = visitComponentArray(
                        group.components,
                        group.identifier
                    );
                    return visitor.visitGroup(group, {
                        parentId: container.identifier,
                        children: visitedComponents,
                    });
                });

                // 3.1.3. include all components in the container
                const visitedComponents = visitComponentArray(
                    container.components,
                    container.identifier
                );

                const visitedConnectedPeople =
                    components.flatMap(visitConnectedPeople);
                const visitedConnectedSoftwareSystems = components.flatMap(
                    visitConnectedSoftwareSystems
                );
                const visitedConnectedContainers = components.flatMap(
                    visitConnectedContainers
                );

                // 3.1.1. include the current container
                visitedElements.add(container.identifier);
                const visitedContainer = visitor.visitContainer(container, {
                    children: visitedGroups.concat(visitedComponents),
                });

                return [visitedContainer]
                    .concat(visitedConnectedPeople)
                    .concat(visitedConnectedSoftwareSystems)
                    .concat(visitedConnectedContainers);
            });

        const visitedRelationships = relationships
            .filter(
                (relationship) =>
                    relationship.sourceIdentifier !==
                    this.view.containerIdentifier
            )
            .filter(
                (relationship) =>
                    relationship.targetIdentifier !==
                    this.view.containerIdentifier
            )
            .filter((relationship) =>
                relationshipExistsForElementsInView(
                    Array.from(visitedElements),
                    relationship
                )
            )
            .map((relationship) => visitor.visitRelationship(relationship));

        return visitedContainer.concat(visitedRelationships);
    }
}
