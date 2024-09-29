import {
    IRelationship,
    ISoftwareSystem,
    ISystemLandscapeDiagram,
    ISystemLandscapeView,
    IWorkspace,
} from "../interfaces";
import { IBuilder, IDiagramVisitor } from "../shared";
import { SystemLandscapeViewStrategy } from "./builders";

export class SystemLandscapeDiagramBuilder
    implements IBuilder<ISystemLandscapeDiagram>
{
    constructor(
        private readonly workspace: IWorkspace,
        private readonly systemLandscapeView: ISystemLandscapeView
    ) {}

    build(): ISystemLandscapeDiagram {
        const strategy = new SystemLandscapeViewStrategy(
            this.workspace.model,
            this.systemLandscapeView
        );
        const visitor = new SystemLandscapeDiagramVisitor();
        // TODO: refactor stratey to accept diagram visitor
        strategy.accept(visitor as any);
        return visitor.diagram;
    }
}

class SystemLandscapeDiagramVisitor
    implements IDiagramVisitor<"all", ISoftwareSystem, "none">
{
    constructor(
        public diagram: ISystemLandscapeDiagram = {
            scope: "all",
            primaryElements: [],
            supportingElements: [],
            relationships: [],
        }
    ) {}

    visitorScopeElement(scope: "all"): void {
        this.diagram.scope = scope;
    }
    visitPrimaryElement(primaryElement: ISoftwareSystem): void {
        this.diagram.primaryElements.push(primaryElement);
    }
    visitSupportingElement(supportingElement: "none"): void {
        this.diagram.supportingElements.push(supportingElement);
    }
    visitRelationship(relationship: IRelationship): void {
        this.diagram.relationships.push(relationship);
    }
}
