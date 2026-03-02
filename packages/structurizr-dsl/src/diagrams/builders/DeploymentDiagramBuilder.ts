import {
    IContainer,
    IContainerInstance,
    IDeploymentDiagram,
    IDeploymentDiagramBuilder,
    IDeploymentEnvironment,
    IDeploymentNode,
    IInfrastructureNode,
    IRelationship,
    ISoftwareSystem,
    ISoftwareSystemInstance,
} from "../../interfaces";
import { IDiagramVisitor } from "../../shared";

export class DeploymentDiagramVisitor
    implements
        IDiagramVisitor<
            IDeploymentEnvironment,
            | IDeploymentNode
            | IInfrastructureNode
            | ISoftwareSystemInstance
            | IContainerInstance
            | ISoftwareSystem
            | IContainer
        >
{
    constructor(public builder: IDeploymentDiagramBuilder) {}

    visitScopeElement(scope: IDeploymentEnvironment): void {
        this.builder.setScope(scope);
    }

    visitSupportingElement(
        supportingElement:
            | IDeploymentNode
            | IInfrastructureNode
            | ISoftwareSystemInstance
            | IContainerInstance
            | ISoftwareSystem
            | IContainer
    ): void {
        this.builder.addSupportingElement(supportingElement);
    }

    visitRelationship(relationship: IRelationship): void {
        this.builder.addRelationship(relationship);
    }
}

export class DeploymentDiagramBuilder implements IDeploymentDiagramBuilder {
    private diagram: IDeploymentDiagram;

    constructor() {
        this.diagram = {
            scope: {} as any,
            supportingElements: [],
            relationships: [],
        };
    }

    build(): IDeploymentDiagram {
        return this.diagram;
    }

    setScope(scope: IDeploymentEnvironment): void {
        this.diagram.scope = scope;
    }

    addSupportingElement(
        supportingElement:
            | IDeploymentNode
            | IInfrastructureNode
            | ISoftwareSystemInstance
            | IContainerInstance
            | ISoftwareSystem
            | IContainer
    ): void {
        this.diagram.supportingElements.push(supportingElement);
    }

    addRelationship(relationship: IRelationship): void {
        this.diagram.relationships.push(relationship);
    }
}
