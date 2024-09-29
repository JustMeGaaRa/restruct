import {
    IContainer,
    IContainerDiagram,
    IContainerView,
    IPerson,
    IRelationship,
    ISoftwareSystem,
    IWorkspace,
} from "../interfaces";
import { IBuilder, IDiagramVisitor } from "../shared";
import { ContainerViewStrategy } from "./builders";

export class ContainerDiagramBuilder implements IBuilder<IContainerDiagram> {
    constructor(
        private readonly workspace: IWorkspace,
        private readonly containerView: IContainerView
    ) {}

    build(): IContainerDiagram {
        const strategy = new ContainerViewStrategy(
            this.workspace.model,
            this.containerView
        );
        const visitor = new ContainerDiagramVisitor();
        // TODO: refactor stratey to accept diagram visitor
        strategy.accept(visitor as any);
        return visitor.diagram;
    }
}

class ContainerDiagramVisitor
    implements
        IDiagramVisitor<ISoftwareSystem, IContainer, ISoftwareSystem | IPerson>
{
    constructor(
        public diagram: IContainerDiagram = {
            scope: {} as any,
            primaryElements: [],
            supportingElements: [],
            relationships: [],
        }
    ) {}

    visitorScopeElement(scope: ISoftwareSystem): void {
        this.diagram.scope = scope;
    }
    visitPrimaryElement(primaryElement: IContainer): void {
        this.diagram.primaryElements.push(primaryElement);
    }
    visitSupportingElement(supportingElement: ISoftwareSystem | IPerson): void {
        this.diagram.supportingElements.push(supportingElement);
    }
    visitRelationship(relationship: IRelationship): void {
        this.diagram.relationships.push(relationship);
    }
}
