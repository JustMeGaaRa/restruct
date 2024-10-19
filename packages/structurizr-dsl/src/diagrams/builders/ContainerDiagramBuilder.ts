import {
    IContainerDiagram,
    IContainerDiagramBuilder,
    IPerson,
    IRelationship,
    ISoftwareSystem,
} from "../../interfaces";
import { IDiagramVisitor } from "../../shared";

export class ContainerDiagramVisitor
    implements IDiagramVisitor<ISoftwareSystem, ISoftwareSystem | IPerson>
{
    constructor(public builder: IContainerDiagramBuilder) {}

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

export class ContainerDiagramBuilder implements IContainerDiagramBuilder {
    private diagram: IContainerDiagram;

    constructor() {
        this.diagram = {
            scope: {} as any,
            supportingElements: [],
            relationships: [],
        };
    }

    build(): IContainerDiagram {
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
