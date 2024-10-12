import { IComponentDiagram, IComponentDiagramBuilder } from "../../interfaces";
import {
    IComponent,
    IContainer,
    IGroup,
    IPerson,
    IRelationship,
    ISoftwareSystem,
} from "../../interfaces";
import { IDiagramVisitor } from "../../shared";

export class ComponentDiagramVisitor
    implements
        IDiagramVisitor<
            IContainer,
            IGroup | IComponent,
            ISoftwareSystem | IContainer | IPerson
        >
{
    constructor(public builder: IComponentDiagramBuilder) {}

    visitorScopeElement(scope: IContainer): void {
        this.builder.setScope(scope);
    }

    visitPrimaryElement(primaryElement: IGroup | IComponent): void {
        this.builder.addPrimaryElement(primaryElement);
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
            primaryElements: [],
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

    addPrimaryElement(primaryElement: IGroup | IComponent): void {
        this.diagram.primaryElements.push(primaryElement);
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
