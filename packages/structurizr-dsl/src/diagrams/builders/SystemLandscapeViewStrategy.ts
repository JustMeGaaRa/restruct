import {
    IGroup,
    IModel,
    IPerson,
    IRelationship,
    ISoftwareSystem,
    ISystemLandscapeView,
} from "../../interfaces";
import { IDiagramVisitor, ISupportVisitor } from "../../shared";
import {
    isRelationshipBetweenElementsInView,
    getImpliedRelationshipsForSystemLandscapeView,
} from "../../utils";

export class SystemLandscapeViewStrategy
    implements
        ISupportVisitor<
            "workspace",
            IGroup | ISoftwareSystem | IPerson,
            unknown
        >
{
    constructor(
        private readonly model: IModel,
        private readonly view: ISystemLandscapeView
    ) {}

    accept(
        visitor: IDiagramVisitor<
            "workspace",
            IGroup | ISoftwareSystem | IPerson,
            unknown
        >
    ): void {
        const visitedElements = new Set<string>();
        const relationships = getImpliedRelationshipsForSystemLandscapeView(
            this.model
        );

        // include all software systems
        const visitSoftwareSystemArray = (
            softwareSystems: Array<ISoftwareSystem>
        ) => {
            softwareSystems.forEach((softwareSystem) => {
                visitedElements.add(softwareSystem.identifier.toString());
                visitor.visitPrimaryElement(softwareSystem);
            });
        };

        // include all people
        const visitPersonArray = (people: Array<IPerson>) => {
            people.forEach((person) => {
                visitedElements.add(person.identifier);
                visitor.visitPrimaryElement(person);
            });
        };

        const visitRelationshipArray = (
            relationships: Array<IRelationship>
        ) => {
            relationships
                .filter((relationship) =>
                    isRelationshipBetweenElementsInView(
                        visitedElements,
                        relationship
                    )
                )
                .forEach((relationship) =>
                    visitor.visitRelationship(relationship)
                );
        };

        // iterate over all groups and find software system for the view
        this.model.groups.flatMap((group) => {
            visitedElements.add(group.identifier);
            visitor.visitPrimaryElement(group);

            visitSoftwareSystemArray(group.softwareSystems);
            visitPersonArray(group.people);
        });

        // iterate over all software systems and find software system for the view
        visitSoftwareSystemArray(this.model.softwareSystems);
        visitPersonArray(this.model.people);
        visitRelationshipArray(relationships);
    }
}
