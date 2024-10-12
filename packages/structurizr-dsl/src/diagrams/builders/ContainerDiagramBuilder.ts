import {
    IContainer,
    IContainerDiagram,
    IContainerDiagramBuilder,
    IGroup,
    IPerson,
    IRelationship,
    ISoftwareSystem,
} from "../../interfaces";
import { IDiagramVisitor } from "../../shared";

export class ContainerDiagramVisitor
    implements
        IDiagramVisitor<
            ISoftwareSystem,
            IGroup | IContainer,
            ISoftwareSystem | IPerson
        >
{
    constructor(public builder: IContainerDiagramBuilder) {}

    visitorScopeElement(scope: ISoftwareSystem): void {
        this.builder.setScope(scope);
    }

    visitPrimaryElement(primaryElement: IGroup | IContainer): void {
        this.builder.addPrimaryElement(primaryElement);
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
            primaryElements: [],
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

    addPrimaryElement(primaryElement: IGroup | IContainer): void {
        this.diagram.primaryElements.push(primaryElement);
    }

    addSupportingElement(supportingElement: ISoftwareSystem | IPerson): void {
        this.diagram.supportingElements.push(supportingElement);
    }

    addRelationship(relationship: IRelationship): void {
        this.diagram.relationships.push(relationship);
    }
}
