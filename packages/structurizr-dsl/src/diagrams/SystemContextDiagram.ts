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

export class SystemContextDiagramBuilder
    implements IBuilder<ISystemContextDiagram>
{
    constructor(
        private readonly workspace: IWorkspace,
        private readonly systemContextView: ISystemContextView
    ) {}

    build(): ISystemContextDiagram {
        const strategy = new SystemContextViewStrategy(
            this.workspace.model,
            this.systemContextView
        );
        const visitor = new SystemContextDiagramVisitor();
        // TODO: refactor stratey to accept diagram visitor
        strategy.accept(visitor as any);
        return visitor.diagram;
    }
}

class SystemContextDiagramVisitor
    implements IDiagramVisitor<ISoftwareSystem, ISoftwareSystem, IPerson>
{
    constructor(
        public diagram: ISystemContextDiagram = {
            scope: {} as any,
            primaryElements: [],
            supportingElements: [],
            relationships: [],
        }
    ) {}

    visitorScopeElement(scope: ISoftwareSystem): void {
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
