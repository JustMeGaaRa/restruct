import {
    IPerson,
    IRelationship,
    ISoftwareSystem,
    ISystemContextDiagram,
    ISystemContextDiagramBuilder,
} from "../../interfaces";
import { IDiagramVisitor } from "../../shared";

export class SystemContextDiagramVisitor
    implements IDiagramVisitor<ISoftwareSystem, ISoftwareSystem | IPerson>
{
    constructor(private builder: ISystemContextDiagramBuilder) {}

    visitScopeElement(scope: ISoftwareSystem): void {
        this.builder.setScope(scope);
    }

    visitSupportingElement(supportingElement: ISoftwareSystem | IPerson): void {
        this.builder.addSupportingElement(supportingElement);
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

    addSupportingElement(supportingElement: ISoftwareSystem | IPerson): void {
        this.diagram.supportingElements.push(supportingElement);
    }

    addRelationship(relationship: IRelationship): void {
        this.diagram.relationships.push(relationship);
    }
}
