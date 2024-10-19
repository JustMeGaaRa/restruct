import { IModel, ISystemLandscapeView } from "../../interfaces";
import { IDiagramVisitor, ISupportVisitor } from "../../shared";
import {
    isRelationshipBetweenElementsInView,
    getImpliedRelationships,
} from "../../utils";

export class SystemLandscapeViewStrategy
    implements ISupportVisitor<IModel, unknown>
{
    constructor(
        private readonly model: IModel,
        private readonly view: ISystemLandscapeView
    ) {}

    accept(visitor: IDiagramVisitor<IModel, unknown>): void {
        const visitedElements = new Set<string>();
        const relationships = getImpliedRelationships(this.model, this.view);

        // iterate over all groups and find software system for the view
        this.model.groups.flatMap((group) => {
            visitedElements.add(group.identifier);

            // visitSoftwareSystemArray(group.softwareSystems);
            // visitPersonArray(group.people);
            group.softwareSystems.forEach((softwareSystem) => {
                visitedElements.add(softwareSystem.identifier.toString());
            });
            group.people.forEach((person) => {
                visitedElements.add(person.identifier);
            });
        });

        // iterate over all software systems and find software system for the view
        this.model.softwareSystems.forEach((softwareSystem) => {
            visitedElements.add(softwareSystem.identifier.toString());
        });

        this.model.people.forEach((person) => {
            visitedElements.add(person.identifier);
        });

        visitor.visitScopeElement?.(this.model);

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
    }
}
