import {
    IModel,
    IPerson,
    IRelationship,
    ISoftwareSystem,
    ISystemLandscapeView,
} from "../../interfaces";
import { IElementVisitor, ISupportVisitor } from "../../shared";
import {
    getRelationships,
    relationshipExistsForElementsInView,
} from "../../utils";

export class SystemLandscapeViewStrategy implements ISupportVisitor {
    constructor(
        private model: IModel,
        private view: ISystemLandscapeView
    ) {}

    accept<T>(visitor: IElementVisitor<T>): Array<T> {
        const visitedElements = new Set<string>();
        const relationships = getRelationships(this.model, false);

        // 2.1. include all software systems
        const visitSoftwareSystemArray = (
            softwareSystems: Array<ISoftwareSystem>,
            parentId?: string
        ) => {
            return softwareSystems.map((softwareSystem) => {
                visitedElements.add(softwareSystem.identifier);
                return visitor.visitSoftwareSystem(softwareSystem, {
                    parentId,
                });
            });
        };

        // 2.1. include all people
        const visitPersonArray = (
            people: Array<IPerson>,
            parentId?: string
        ) => {
            return people.map((person) => {
                visitedElements.add(person.identifier);
                return visitor.visitPerson(person, { parentId });
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
        const visitedGroups = this.model.groups.map((group) => {
            // 1.1.1.2. include people and software systems in the group
            const visitedSoftwareSystems = visitSoftwareSystemArray(
                group.softwareSystems,
                group.identifier
            );
            const visitedPeople = visitPersonArray(
                group.people,
                group.identifier
            );

            // 1.1.1.1. include the software system group as a boundary element
            visitedElements.add(group.identifier);
            return visitor.visitGroup(group, {
                children: visitedSoftwareSystems.concat(visitedPeople),
            });
        });

        // 1.2. iterate over all software systems and find software system for the view
        const visitedSoftwareSystems = visitSoftwareSystemArray(
            this.model.softwareSystems
        );
        const visitedPeople = visitPersonArray(this.model.people);
        const visitedRelationships = visitRelationshipArray(relationships);

        return visitedGroups
            .concat(visitedSoftwareSystems)
            .concat(visitedPeople)
            .concat(visitedRelationships);
    }
}
