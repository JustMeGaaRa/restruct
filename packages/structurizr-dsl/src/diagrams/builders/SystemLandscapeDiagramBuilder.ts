import {
    IModel,
    IRelationship,
    ISystemLandscapeDiagram,
    ISystemLandscapeDiagramBuilder,
} from "../../interfaces";
import { IDiagramVisitor } from "../../shared";

export class SystemLandscapeDiagramVisitor
    implements IDiagramVisitor<IModel, unknown>
{
    constructor(private builder: ISystemLandscapeDiagramBuilder) {}

    visitScopeElement(scope: IModel): void {
        this.builder.setScope(scope);
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
            scope: {} as any,
            supportingElements: [],
            relationships: [],
        };
    }

    build(): ISystemLandscapeDiagram {
        return this.diagram;
    }

    setScope(scope: IModel): void {
        this.diagram.scope = scope;
    }

    addRelationship(relationship: IRelationship): void {
        this.diagram.relationships.push(relationship);
    }
}
