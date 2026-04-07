import {
    IContainer,
    IContainerInstance,
    IDeploymentEnvironment,
    IDeploymentNode,
    IDeploymentView,
    IInfrastructureNode,
    IRelationship,
    ISoftwareSystem,
    ISoftwareSystemInstance,
    IWorkspace,
} from "../../interfaces";
import { IDiagramVisitor, ISupportDiagramVisitor } from "../../shared";
import { createWorkspaceExplorer, isRelationshipInView } from "../../utils";

export class DeploymentViewStrategy
    implements
        ISupportDiagramVisitor<
            IDeploymentEnvironment,
            | IDeploymentNode
            | IInfrastructureNode
            | ISoftwareSystemInstance
            | IContainerInstance
            | ISoftwareSystem
            | IContainer
        >
{
    constructor(
        private readonly workspace: IWorkspace,
        private readonly view: IDeploymentView
    ) {}

    accept(
        visitor: IDiagramVisitor<
            IDeploymentEnvironment,
            | IDeploymentNode
            | IInfrastructureNode
            | ISoftwareSystemInstance
            | IContainerInstance
            | ISoftwareSystem
            | IContainer
        >
    ): void {
        const { getImpliedRelationships } = createWorkspaceExplorer(
            this.workspace
        );
        const visitedElements = new Set<string>();
        const relationships = getImpliedRelationships(this.view);

        const visitDeploymentNode = (deploymentNode: IDeploymentNode) => {
            deploymentNode.infrastructureNodes?.forEach((node) => {
                visitedElements.add(node.identifier);
            });

            deploymentNode.softwareSystemInstances?.forEach((instance) => {
                visitedElements.add(instance.identifier!);
            });

            deploymentNode.containerInstances?.forEach((instance) => {
                visitedElements.add(instance.identifier!);
            });

            deploymentNode.deploymentNodes?.forEach(visitDeploymentNode);

            visitedElements.add(deploymentNode.identifier);
        };

        // TODO(deployment): handle the deployment view scoped to a specific software system instance
        const visitDeploymentEnvironmentInScope = () => {
            this.workspace.model.deploymentEnvironments
                .filter(
                    (deploymentEnvironment) =>
                        deploymentEnvironment.name === this.view.environment ||
                        deploymentEnvironment.identifier ===
                            this.view.environment
                )
                .forEach((deploymentEnvironment) => {
                    visitedElements.add(deploymentEnvironment.identifier);
                    visitor.visitScopeElement?.(deploymentEnvironment);

                    deploymentEnvironment.deploymentNodes.map(
                        (deploymentNode) => {
                            visitDeploymentNode(deploymentNode);
                        }
                    );
                });
        };

        const visitRelationshipArray = (
            relationships: Array<IRelationship>
        ) => {
            relationships
                .filter((relationship) =>
                    isRelationshipInView(visitedElements, relationship)
                )
                .forEach((relationship) =>
                    visitor.visitRelationship?.(relationship)
                );
        };

        visitDeploymentEnvironmentInScope();
        visitRelationshipArray(relationships);
    }
}
