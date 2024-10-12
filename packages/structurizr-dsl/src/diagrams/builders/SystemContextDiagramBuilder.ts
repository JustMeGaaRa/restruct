import {
    IPerson,
    IRelationship,
    ISoftwareSystem,
    ISystemContextDiagram,
    ISystemContextDiagramBuilder,
} from "../../interfaces";
import { IDiagramVisitor } from "../../shared";

export class SystemContextDiagramVisitor
    implements
        IDiagramVisitor<ISoftwareSystem, ISoftwareSystem | IPerson, unknown>
{
    constructor(public builder: ISystemContextDiagramBuilder) {}

    visitorScopeElement(scope: ISoftwareSystem): void {
        this.builder.setScope(scope);
    }

    visitPrimaryElement(primaryElement: ISoftwareSystem | IPerson): void {
        this.builder.addPrimaryElement(primaryElement);
    }

    visitRelationship(relationship: IRelationship): void {
        this.builder.addRelationship(relationship);
    }
}

export class SystemContextDiagramBuilder
    implements ISystemContextDiagramBuilder
{
    private diagram: ISystemContextDiagram;

    constructor() {
        this.diagram = {
            scope: {} as any,
            primaryElements: [],
            supportingElements: [],
            relationships: [],
        };
    }

    build(): ISystemContextDiagram {
        return this.diagram;
    }

    setScope(scope: ISoftwareSystem): void {
        this.diagram.scope = scope;
    }

    addPrimaryElement(primaryElement: ISoftwareSystem | IPerson): void {
        this.diagram.primaryElements.push(primaryElement);
    }

    addRelationship(relationship: IRelationship): void {
        this.diagram.relationships.push(relationship);
    }
}
