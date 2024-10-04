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
    visitImpliedRelationships,
    isRelationshipBetweenElementsInView,
    visitWorkspaceHierarchy,
    isSoftwareSystem,
    cacheElements,
    isPerson,
} from "../../utils";

export class SystemLandscapeViewStrategy
    implements
        ISupportVisitor<unknown, IGroup | ISoftwareSystem | IPerson, unknown>
{
    constructor(
        private readonly model: IModel,
        private readonly view: ISystemLandscapeView
    ) {}

    accept(
        visitor: IDiagramVisitor<
            unknown,
            IGroup | ISoftwareSystem | IPerson,
            unknown
        >
    ): void {
        const visitedElements = new Set<string>();
        const relationships = visitImpliedRelationships(this.model);
        const elements = visitWorkspaceHierarchy(this.model);
        const elementBag = cacheElements(elements);

        // 2.1. include all software systems
        const visitSoftwareSystemArray = (
            softwareSystems: Array<ISoftwareSystem>
        ) => {
            softwareSystems.forEach((softwareSystem) => {
                visitedElements.add(softwareSystem.identifier.toString());
                visitor.visitPrimaryElement(softwareSystem);
            });
        };

        // 2.1. include all people
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
                    // filter for elements that are present on view
                    isRelationshipBetweenElementsInView(
                        visitedElements,
                        relationship
                    )
                )
                .forEach((relationship) =>
                    visitor.visitRelationship(relationship)
                );
        };

        // 1.1. iterate over all groups and find software system for the view
        this.model.groups.flatMap((group) => {
            // 1.1.1.2. include people and software systems in the group
            visitSoftwareSystemArray(group.softwareSystems);
            visitPersonArray(group.people);
            visitor.visitPrimaryElement(group);

            // 1.1.1.1. include the software system group as a boundary element
            visitedElements.add(group.identifier);
        });

        // 1.2. iterate over all software systems and find software system for the view
        visitSoftwareSystemArray(this.model.softwareSystems);
        visitPersonArray(this.model.people);
        visitRelationshipArray(relationships);
    }
}
