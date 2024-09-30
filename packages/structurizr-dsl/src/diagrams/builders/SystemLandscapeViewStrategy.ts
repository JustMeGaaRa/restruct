import {
    IModel,
    IPerson,
    IRelationship,
    ISoftwareSystem,
    ISystemLandscapeView,
} from "../../interfaces";
import { IDiagramVisitor, ISupportVisitor } from "../../shared";
import {
    getRelationships,
    relationshipExistsForElementsInView,
} from "../../utils";

export class SystemLandscapeViewStrategy
    implements ISupportVisitor<unknown, ISoftwareSystem | IPerson, unknown>
{
    constructor(
        private readonly model: IModel,
        private readonly view: ISystemLandscapeView
    ) {}

    accept(
        visitor: IDiagramVisitor<unknown, ISoftwareSystem | IPerson, unknown>
    ): void {
        const visitedElements = new Set<string>();
        const relationships = getRelationships(this.model, false);

        // 2.1. include all software systems
        const visitSoftwareSystemArray = (
            softwareSystems: Array<ISoftwareSystem>
        ) => {
            return softwareSystems.map((softwareSystem) => {
                visitedElements.add(softwareSystem.identifier);
                return visitor.visitPrimaryElement(softwareSystem);
            });
        };

        // 2.1. include all people
        const visitPersonArray = (people: Array<IPerson>) => {
            return people.map((person) => {
                visitedElements.add(person.identifier);
                return visitor.visitPrimaryElement(person);
            });
        };

        const visitRelationshipArray = (
            relationships: Array<IRelationship>
        ) => {
            return relationships
                .filter((relationship) =>
                    relationshipExistsForElementsInView(
                        Array.from(visitedElements),
                        relationship
                    )
                )
                .map((relationship) => visitor.visitRelationship(relationship));
        };

        // 1.1. iterate over all groups and find software system for the view
        this.model.groups.flatMap((group) => {
            // 1.1.1.2. include people and software systems in the group
            visitSoftwareSystemArray(group.softwareSystems);
            visitPersonArray(group.people);

            // 1.1.1.1. include the software system group as a boundary element
            visitedElements.add(group.identifier);
        });

        // 1.2. iterate over all software systems and find software system for the view
        visitSoftwareSystemArray(this.model.softwareSystems);
        visitPersonArray(this.model.people);
        visitRelationshipArray(relationships);
    }
}
