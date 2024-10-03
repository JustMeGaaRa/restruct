import {
    IContainer,
    IContainerDiagram,
    IContainerView,
    IPerson,
    IRelationship,
    ISoftwareSystem,
    IWorkspace,
} from "../interfaces";
import { IBuilder, IDiagramVisitor } from "../shared";
import { ContainerViewStrategy } from "./builders";

export class ContainerDiagram
    implements IContainerDiagram, IBuilder<IContainerDiagram>
{
    constructor(
        private readonly workspace: IWorkspace,
        private readonly containerView: IContainerView
    ) {
        this.scope = {} as any;
        this.primaryElements = [];
        this.supportingElements = [];
        this.relationships = [];
    }

    public scope: ISoftwareSystem;
    public primaryElements: IContainer[];
    public supportingElements: (ISoftwareSystem | IPerson)[];
    public relationships: IRelationship[];

    build(): IContainerDiagram {
        const strategy = new ContainerViewStrategy(
            this.workspace.model,
            this.containerView
        );
        strategy.accept(new ContainerDiagramVisitor(this));
        return this;
    }
}

class ContainerDiagramVisitor
    implements
        IDiagramVisitor<ISoftwareSystem, IContainer, ISoftwareSystem | IPerson>
{
    constructor(public diagram: IContainerDiagram) {}

    visitorScopeElement(scope: ISoftwareSystem): void {
        this.diagram.scope = scope;
    }
    visitPrimaryElement(primaryElement: IContainer): void {
        this.diagram.primaryElements.push(primaryElement);
    }
    visitSupportingElement(supportingElement: ISoftwareSystem | IPerson): void {
        this.diagram.supportingElements.push(supportingElement);
    }
    visitRelationship(relationship: IRelationship): void {
        this.diagram.relationships.push(relationship);
    }
}
