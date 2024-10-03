import {
    IComponent,
    IComponentDiagram,
    IComponentView,
    IContainer,
    IPerson,
    IRelationship,
    ISoftwareSystem,
    IWorkspace,
} from "../interfaces";
import { IBuilder, IDiagramVisitor } from "../shared";
import { ComponentViewStrategy } from "./builders";

export class ComponentDiagram
    implements IComponentDiagram, IBuilder<IComponentDiagram>
{
    constructor(
        private readonly workspace: IWorkspace,
        private readonly componentView: IComponentView
    ) {
        this.scope = {} as any;
        this.primaryElements = [];
        this.supportingElements = [];
        this.relationships = [];
    }

    public scope: IContainer;
    public primaryElements: IComponent[];
    public supportingElements: (IContainer | ISoftwareSystem | IPerson)[];
    public relationships: IRelationship[];

    build(): IComponentDiagram {
        const strategy = new ComponentViewStrategy(
            this.workspace.model,
            this.componentView
        );
        strategy.accept(new ComponentDiagramVisitor(this));
        return this;
    }
}

class ComponentDiagramVisitor
    implements
        IDiagramVisitor<
            IContainer,
            IComponent,
            ISoftwareSystem | IContainer | IPerson
        >
{
    constructor(public diagram: IComponentDiagram) {}

    visitorScopeElement(scope: IContainer): void {
        this.diagram.scope = scope;
    }
    visitPrimaryElement(primaryElement: IComponent): void {
        this.diagram.primaryElements.push(primaryElement);
    }
    visitSupportingElement(
        supportingElement: ISoftwareSystem | IContainer | IPerson
    ): void {
        this.diagram.supportingElements.push(supportingElement);
    }
    visitRelationship(relationship: IRelationship): void {
        this.diagram.relationships.push(relationship);
    }
}
