import { IModel, ISystemLandscapeView, IWorkspace } from "../../interfaces";
import { IDiagramVisitor, ISupportDiagramVisitor } from "../../shared";
import { createWorkspaceExplorer, isRelationshipInView } from "../../utils";

export class SystemLandscapeViewStrategy
    implements ISupportDiagramVisitor<IModel, unknown>
{
    constructor(
        private readonly workspace: IWorkspace,
        private readonly view: ISystemLandscapeView
    ) {}

    accept(visitor: IDiagramVisitor<IModel, unknown>): void {
        const { getImpliedRelationships } = createWorkspaceExplorer(
            this.workspace
        );
        const visitedElements = new Set<string>();
        const relationships = getImpliedRelationships(this.view);

        // iterate over all groups and find software system for the view
        this.workspace.model.groups.flatMap((group) => {
            visitedElements.add(group.identifier);

            group.softwareSystems.forEach((softwareSystem) => {
                visitedElements.add(softwareSystem.identifier.toString());
            });
            group.people.forEach((person) => {
                visitedElements.add(person.identifier);
            });
        });

        // iterate over all software systems and find software system for the view
        this.workspace.model.softwareSystems.forEach((softwareSystem) => {
            visitedElements.add(softwareSystem.identifier.toString());
        });

        this.workspace.model.people.forEach((person) => {
            visitedElements.add(person.identifier);
        });

        visitor.visitScopeElement?.(this.workspace.model);

        relationships
            .filter((relationship) =>
                isRelationshipInView(visitedElements, relationship)
            )
            .forEach((relationship) =>
                visitor.visitRelationship?.(relationship)
            );
    }
}
