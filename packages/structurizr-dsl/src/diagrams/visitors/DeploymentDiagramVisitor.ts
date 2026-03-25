import {
    IDeploymentEnvironment,
    IDeploymentNode,
    IInfrastructureNode,
    ISoftwareSystemInstance,
    IContainerInstance,
    ISoftwareSystem,
    IContainer,
    IDeploymentDiagramBuilder,
    IRelationship,
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
