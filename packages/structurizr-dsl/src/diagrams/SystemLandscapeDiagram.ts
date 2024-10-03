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

export class SystemLandscapeDiagram
    implements ISystemLandscapeDiagram, IBuilder<ISystemLandscapeDiagram>
{
    constructor(
        private readonly workspace: IWorkspace,
        private readonly systemLandscapeView: ISystemLandscapeView
    ) {
        this.scope = undefined;
        this.primaryElements = [];
        this.supportingElements = [];
        this.relationships = [];
    }

    public scope: unknown;
    public primaryElements: (ISoftwareSystem | IPerson)[];
    public supportingElements: unknown[];
    public relationships: IRelationship[];

    build(): ISystemLandscapeDiagram {
        const strategy = new SystemLandscapeViewStrategy(
            this.workspace.model,
            this.systemLandscapeView
        );
        strategy.accept(new SystemLandscapeDiagramVisitor(this));
        return this;
    }
}

export class SystemLandscapeDiagramVisitor
    implements IDiagramVisitor<unknown, ISoftwareSystem | IPerson, unknown>
{
    constructor(private diagram: ISystemLandscapeDiagram) {}

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
