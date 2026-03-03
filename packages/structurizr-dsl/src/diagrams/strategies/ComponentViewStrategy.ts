import {
    IComponent,
    IComponentView,
    IContainer,
    IModel,
    IPerson,
    ISoftwareSystem,
} from "../../interfaces";
import { IDiagramVisitor, ISupportDiagramVisitor } from "../../shared";
import {
    anyRelationshipEquals,
    createWorkspaceExplorer,
    isElementExplicitlyIncludedInView,
    isRelationshipInView,
} from "../../utils";

export class ComponentViewStrategy
    implements
        ISupportDiagramVisitor<
            IContainer,
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
            ISoftwareSystem | IContainer | IPerson
        >
    ): void {
        const {
            getWorkspacePeople,
            getWorkspaceSoftwareSystems,
            getWorkspaceContainers,
            getWorkspaceRelationships,
        } = createWorkspaceExplorer(this.model);
        const visitedElements = new Map<string, string>();
        const relationships = getWorkspaceRelationships();
        const people = getWorkspacePeople();
        const softwareSystems = getWorkspaceSoftwareSystems();
        const containers = getWorkspaceContainers();

        // 4.1.2. include all people that are directly connected to the current component
        const visitConnectedPeople = (component: IComponent) => {
            people
                .filter(
                    (person) =>
                        anyRelationshipEquals(
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
                    visitor.visitSupportingElement?.(person);
                });
        };

        // 4.1.3. include all software systems that are directly connected to the current component
        const visitConnectedSoftwareSystems = (component: IComponent) => {
            softwareSystems
                .filter(
                    (softwareSystem) =>
                        anyRelationshipEquals(
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
                    visitor.visitSupportingElement?.(softwareSystem);
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
                        anyRelationshipEquals(
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
                    visitor.visitSupportingElement?.(container);
                });
        };

        // 4.1. iterate over all components and include them
        const visitComponentArray = (components: Array<IComponent>) => {
            components.forEach((component) => {
                visitedElements.set(component.identifier, component.name);
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
                visitor.visitScopeElement?.(container);
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
                isRelationshipInView(visitedElements, relationship)
            )
            .forEach((relationship) =>
                visitor.visitRelationship?.(relationship)
            );
    }
}
