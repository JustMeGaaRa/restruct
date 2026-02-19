import { IWorkspace, RelationshipType } from "../../interfaces";
import { IElementVisitor } from "../../shared";

export class ModelViewStrategy {
    constructor(private workspace: IWorkspace) {}

    public static PlaceholderModelWorkspaceId = "workspace";

    accept<T>(visitor: IElementVisitor<T>): Array<T> {
        const visitedWorkspace = visitor.visitWorkspace?.(this.workspace);

        const visitedGroups = this.workspace.model.groups
            .flatMap((group) => group.softwareSystems)
            .concat(this.workspace.model.softwareSystems)
            .flatMap((softwareSystem) => {
                const visitedGroups = softwareSystem.groups
                    .flatMap((group) => group.containers)
                    .concat(softwareSystem.containers)
                    .flatMap((container) => {
                        const visitedGroups = container.groups
                            .flatMap((group) => group.components)
                            .concat(container.components)
                            .flatMap((component) => {
                                const visistedComponent =
                                    visitor.visitComponent?.(component);
                                const visitedRelationships =
                                    visitor.visitRelationship?.({
                                        type: RelationshipType.Relationship,
                                        identifier: `${container.identifier}-${component.identifier}`,
                                        sourceIdentifier: container.identifier,
                                        targetIdentifier: component.identifier,
                                        tags: [],
                                    });
                                return [visistedComponent].concat(
                                    visitedRelationships
                                );
                            });

                        const visitedContainer =
                            visitor.visitContainer?.(container);
                        const visitedRelationships =
                            visitor.visitRelationship?.({
                                type: RelationshipType.Relationship,
                                identifier: `${softwareSystem.identifier}-${container.identifier}`,
                                sourceIdentifier: softwareSystem.identifier,
                                targetIdentifier: container.identifier,
                                tags: [],
                            });

                        return [visitedContainer]
                            .concat(visitedGroups)
                            .concat(visitedRelationships);
                    });

                const visitedSoftwareSystem =
                    visitor.visitSoftwareSystem?.(softwareSystem);
                const visitedRelationships = visitor.visitRelationship?.({
                    type: RelationshipType.Relationship,
                    identifier: `${ModelViewStrategy.PlaceholderModelWorkspaceId}-${softwareSystem.identifier}`,
                    sourceIdentifier:
                        ModelViewStrategy.PlaceholderModelWorkspaceId,
                    targetIdentifier: softwareSystem.identifier,
                    tags: [],
                });

                return [visitedSoftwareSystem]
                    .concat(visitedGroups)
                    .concat(visitedRelationships);
            });

        const visitedPeople = this.workspace.model.groups
            .flatMap((group) => group.people)
            .concat(this.workspace.model.people)
            .flatMap((person) => {
                const visitedPerson = visitor.visitPerson?.(person);
                const visitedRelationships = visitor.visitRelationship?.({
                    type: RelationshipType.Relationship,
                    identifier: `${ModelViewStrategy.PlaceholderModelWorkspaceId}-${person.identifier}`,
                    sourceIdentifier:
                        ModelViewStrategy.PlaceholderModelWorkspaceId,
                    targetIdentifier: person.identifier,
                    tags: [],
                });
                return [visitedPerson].concat(visitedRelationships);
            });

        // TODO: add environments with deployment nodes to model view
        return [visitedWorkspace]
            .concat(visitedGroups)
            .concat(visitedPeople)
            .filter((element) => element !== undefined) as Array<T>;
    }
}
