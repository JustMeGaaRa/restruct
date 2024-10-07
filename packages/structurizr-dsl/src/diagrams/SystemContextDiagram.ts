import {
    IPerson,
    IRelationship,
    ISoftwareSystem,
    ISystemContextDiagram,
    ISystemContextView,
    IWorkspace,
} from "../interfaces";
import { IBuilder, IDiagramVisitor } from "../shared";
import { SystemContextViewStrategy } from "./builders";

export class SystemContextDiagram
    implements ISystemContextDiagram, IBuilder<ISystemContextDiagram>
{
    constructor(
        private readonly workspace: IWorkspace,
        private readonly systemContextView: ISystemContextView
    ) {
        this.scope = {} as any;
        this.primaryElements = [];
        this.supportingElements = [];
        this.relationships = [];
    }

    public scope: ISoftwareSystem;
    public primaryElements: Array<ISoftwareSystem | IPerson>;
    public supportingElements: Array<unknown>;
    public relationships: Array<IRelationship>;

    build(): ISystemContextDiagram {
        const strategy = new SystemContextViewStrategy(
            this.workspace.model,
            this.systemContextView
        );
        strategy.accept(new SystemContextDiagramVisitor(this));
        return this;
    }
}

class SystemContextDiagramVisitor
    implements
        IDiagramVisitor<ISoftwareSystem, ISoftwareSystem | IPerson, unknown>
{
    constructor(public diagram: ISystemContextDiagram) {}

    visitorScopeElement(scope: ISoftwareSystem): void {
        this.diagram.scope = scope;
    }
    visitPrimaryElement(primaryElement: ISoftwareSystem | IPerson): void {
        this.diagram.primaryElements.push(primaryElement);
    }
    visitSupportingElement(supportingElement: unknown): void {
        this.diagram.supportingElements.push(supportingElement);
    }
    visitRelationship(relationship: IRelationship): void {
        this.diagram.relationships.push(relationship);
    }
}
