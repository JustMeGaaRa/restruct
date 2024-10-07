import {
    IGroup,
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
        this.scope = "workspace";
        this.primaryElements = [];
        this.supportingElements = [];
        this.relationships = [];
    }

    public scope: "workspace";
    public primaryElements: Array<ISoftwareSystem | IPerson>;
    public supportingElements: Array<unknown>;
    public relationships: Array<IRelationship>;

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
    implements
        IDiagramVisitor<unknown, IGroup | ISoftwareSystem | IPerson, unknown>
{
    constructor(private diagram: ISystemLandscapeDiagram) {}

    visitorScopeElement(scope: "workspace"): void {
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
