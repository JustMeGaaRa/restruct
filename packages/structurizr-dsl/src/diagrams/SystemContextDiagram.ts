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
        this.scope = undefined;
        this.primaryElements = [];
        this.supportingElements = [];
        this.relationships = [];
    }

    public scope: unknown;
    public primaryElements: ISoftwareSystem[];
    public supportingElements: (ISoftwareSystem | IPerson)[];
    public relationships: IRelationship[];

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
        IDiagramVisitor<unknown, ISoftwareSystem, ISoftwareSystem | IPerson>
{
    constructor(public diagram: ISystemContextDiagram) {}

    visitorScopeElement(scope: unknown): void {
        this.diagram.scope = scope;
    }
    visitPrimaryElement(primaryElement: ISoftwareSystem): void {
        this.diagram.primaryElements.push(primaryElement);
    }
    visitSupportingElement(supportingElement: IPerson): void {
        this.diagram.supportingElements.push(supportingElement);
    }
    visitRelationship(relationship: IRelationship): void {
        this.diagram.relationships.push(relationship);
    }
}
