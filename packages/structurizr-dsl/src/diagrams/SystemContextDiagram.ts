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
        strategy.accept(visitor);
        return visitor.diagram;
    }
}

class SystemContextDiagramVisitor
    implements
        IDiagramVisitor<unknown, ISoftwareSystem, ISoftwareSystem | IPerson>
{
    constructor(
        public diagram: ISystemContextDiagram = {
            scope: {} as any,
            primaryElements: [],
            supportingElements: [],
            relationships: [],
        }
    ) {}

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
