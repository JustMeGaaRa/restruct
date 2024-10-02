import {
    IPerson,
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
        strategy.accept(visitor);
        return visitor.diagram;
    }
}

export class SystemLandscapeDiagramVisitor
    implements IDiagramVisitor<unknown, ISoftwareSystem | IPerson, unknown>
{
    constructor(
        public diagram: ISystemLandscapeDiagram = {
            scope: undefined,
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
    visitSupportingElement(supportingElement: unknown): void {
        this.diagram.supportingElements.push(supportingElement);
    }
    visitRelationship(relationship: IRelationship): void {
        this.diagram.relationships.push(relationship);
    }
}
