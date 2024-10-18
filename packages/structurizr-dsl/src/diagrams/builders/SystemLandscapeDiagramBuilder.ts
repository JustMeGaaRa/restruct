import {
    IGroup,
    IPerson,
    IRelationship,
    ISoftwareSystem,
    ISystemLandscapeDiagram,
    ISystemLandscapeDiagramBuilder,
} from "../../interfaces";
import { IDiagramVisitor } from "../../shared";

export class SystemLandscapeDiagramVisitor
    implements
        IDiagramVisitor<unknown, IGroup | ISoftwareSystem | IPerson, unknown>
{
    constructor(private builder: ISystemLandscapeDiagramBuilder) {}

    visitPrimaryElement(
        primaryElement: IGroup | ISoftwareSystem | IPerson
    ): void {
        this.builder.addPrimaryElement(primaryElement);
    }

    visitRelationship(relationship: IRelationship): void {
        this.builder.addRelationship(relationship);
    }
}

export class SystemLandscapeDiagramBuilder
    implements ISystemLandscapeDiagramBuilder
{
    private diagram: ISystemLandscapeDiagram;

    constructor() {
        this.diagram = {
            scope: "workspace",
            primaryElements: [],
            supportingElements: [],
            relationships: [],
        };
    }

    build(): ISystemLandscapeDiagram {
        return this.diagram;
    }

    addPrimaryElement(
        primaryElement: IGroup | ISoftwareSystem | IPerson
    ): void {
        this.diagram.primaryElements.push(primaryElement);
    }

    addRelationship(relationship: IRelationship): void {
        this.diagram.relationships.push(relationship);
    }
}
