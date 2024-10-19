import { IComponentDiagram, IComponentDiagramBuilder } from "../../interfaces";
import {
    IContainer,
    IPerson,
    IRelationship,
    ISoftwareSystem,
} from "../../interfaces";
import { IDiagramVisitor } from "../../shared";

export class ComponentDiagramVisitor
    implements
        IDiagramVisitor<IContainer, ISoftwareSystem | IContainer | IPerson>
{
    constructor(public builder: IComponentDiagramBuilder) {}

    visitScopeElement(scope: IContainer): void {
        this.builder.setScope(scope);
    }

    visitSupportingElement(
        supportingElement: ISoftwareSystem | IContainer | IPerson
    ): void {
        this.builder.addSupportingElement(supportingElement);
    }

    visitRelationship(relationship: IRelationship): void {
        this.builder.addRelationship(relationship);
    }
}

export class ComponentDiagramBuilder implements IComponentDiagramBuilder {
    private diagram: IComponentDiagram;

    constructor() {
        this.diagram = {
            scope: {} as any,
            supportingElements: [],
            relationships: [],
        };
    }

    build(): IComponentDiagram {
        return this.diagram;
    }

    setScope(scope: IContainer): void {
        this.diagram.scope = scope;
    }

    addSupportingElement(
        supportingElement: ISoftwareSystem | IContainer | IPerson
    ): void {
        this.diagram.supportingElements.push(supportingElement);
    }

    addRelationship(relationship: IRelationship): void {
        this.diagram.relationships.push(relationship);
    }
}
