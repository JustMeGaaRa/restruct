import {
    IComponent,
    IComponentView,
    IContainer,
    IModel,
    IPerson,
    ISoftwareSystem,
} from "../../interfaces";
import { IDiagramVisitor, ISupportVisitor } from "../../shared";
import {
    isElementExplicitlyIncludedInView,
    isRelationshipBetweenElementsInView,
    doesRelationshipExist,
    visitWorkspaceRelationships,
} from "../../utils";

export class ComponentViewStrategy
    implements
        ISupportVisitor<
            IContainer,
            IComponent,
            ISoftwareSystem | IContainer | IPerson
        >
{
    constructor(
        private model: IModel,
        private view: IComponentView
    ) {}

    accept(
        visitor: IDiagramVisitor<
            IContainer,
            IComponent,
            ISoftwareSystem | IContainer | IPerson
        >
    ): void {
        const visitedElements = new Map<string, string>();
        const relationships = visitWorkspaceRelationships(this.model);
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
            people
                .filter(
                    (person) =>
                        doesRelationshipExist(
                            relationships,
                            component.identifier,
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

        // 4.1.3. include all software systems that are directly connected to the current component
        const visitConnectedSoftwareSystems = (component: IComponent) => {
            softwareSystems
                .filter(
                    (softwareSystem) =>
                        doesRelationshipExist(
                            relationships,
                            component.identifier,
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
                    visitedElements.set(
                        softwareSystem.identifier,
                        softwareSystem.name
                    );
                    visitor.visitSupportingElement(softwareSystem);
                });
        };

        // 4.1.4. include all containers that are directly connected to the current container
        const visitConnectedContainers = (component: IComponent) => {
            containers
                .filter(
                    (container) =>
                        container.identifier !== this.view.containerIdentifier
                )
                .filter(
                    (container) =>
                        doesRelationshipExist(
                            relationships,
                            component.identifier,
                            container.identifier
                        ) ||
                        isElementExplicitlyIncludedInView(
                            this.view,
                            container.identifier
                        )
                )
                .filter(
                    (container) => !visitedElements.has(container.identifier)
                )
                .forEach((container) => {
                    visitedElements.set(container.identifier, container.name);
                    visitor.visitSupportingElement(container);
                });
        };

        // 4.1. iterate over all components and include them
        const visitComponentArray = (components: Array<IComponent>) => {
            components.forEach((component) => {
                visitedElements.set(component.identifier, component.name);
                visitor.visitPrimaryElement(component);
            });
        };

        // 3.1. iterate over all containers to find the one for the view
        containers
            .filter(
                (container) =>
                    container.identifier === this.view.containerIdentifier
            )
            .flatMap((container) => {
                const components = container.groups
                    .flatMap((x) => x.components)
                    .concat(container.components);

                // 3.1.2. iterate over all groups in the container and the group itself
                container.groups.forEach((group) => {
                    visitedElements.set(group.identifier, group.name);
                    visitComponentArray(group.components);
                    // visitor.visitGroup(group);
                });

                // 3.1.3. include all components in the container
                visitComponentArray(container.components);

                components.forEach(visitConnectedPeople);
                components.forEach(visitConnectedSoftwareSystems);
                components.forEach(visitConnectedContainers);

                // 3.1.1. include the current container
                visitedElements.set(container.identifier, container.name);
                visitor.visitorScopeElement(container);
            });

        relationships
            .filter(
                (relationship) =>
                    relationship.sourceIdentifier !==
                        this.view.containerIdentifier &&
                    relationship.targetIdentifier !==
                        this.view.containerIdentifier
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
