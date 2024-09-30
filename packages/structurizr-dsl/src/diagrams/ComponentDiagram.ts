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

export class ComponentDiagramBuilder implements IBuilder<IComponentDiagram> {
    constructor(
        private readonly workspace: IWorkspace,
        private readonly componentView: IComponentView
    ) {}

    build(): IComponentDiagram {
        const strategy = new ComponentViewStrategy(
            this.workspace.model,
            this.componentView
        );
        const visitor = new ComponentDiagramVisitor();
        strategy.accept(visitor);
        return visitor.diagram;
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
    constructor(
        public diagram: IComponentDiagram = {
            scope: {} as any,
            primaryElements: [],
            supportingElements: [],
            relationships: [],
        }
    ) {}

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
