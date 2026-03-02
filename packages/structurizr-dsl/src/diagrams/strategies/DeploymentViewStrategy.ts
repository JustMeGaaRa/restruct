import {
    IContainer,
    IContainerInstance,
    IDeploymentEnvironment,
    IDeploymentNode,
    IDeploymentView,
    IInfrastructureNode,
    IModel,
    IRelationship,
    ISoftwareSystem,
    ISoftwareSystemInstance,
} from "../../interfaces";
import { IDiagramVisitor, ISupportVisitor } from "../../shared";
import {
    isRelationshipBetweenElementsInView,
    getImpliedRelationships,
} from "../../utils";

export class DeploymentViewStrategy
    implements
        ISupportVisitor<
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
        private readonly model: IModel,
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
        const visitedElements = new Set<string>();
        const relationships = getImpliedRelationships(this.model, this.view);
        const softwareSystems = this.model.groups
            .flatMap((group) => group.softwareSystems)
            .concat(this.model.softwareSystems);
        const containers = softwareSystems
            .flatMap((x) => x.groups.flatMap((group) => group.containers))
            .concat(softwareSystems.flatMap((system) => system.containers));

        const visitDeploymentNode = (deploymentNode: IDeploymentNode) => {
            deploymentNode.infrastructureNodes?.forEach((node) => {
                visitedElements.add(node.identifier);
                visitor.visitSupportingElement?.(node);
            });

            deploymentNode.softwareSystemInstances?.forEach((instance) => {
                // TODO(workspace): use cached/memoized lookup
                const softwareSystem = softwareSystems.find(
                    (softwareSystem) =>
                        softwareSystem.identifier ===
                        instance.softwareSystemIdentifier
                )!;

                visitedElements.add(instance.identifier!);
                visitedElements.add(instance.softwareSystemIdentifier);

                visitor.visitSupportingElement?.(softwareSystem);
                visitor.visitSupportingElement?.(instance);
            });

            deploymentNode.containerInstances?.forEach((instance) => {
                // TODO(workspace): use cached/memoized lookup
                const container = containers.find(
                    (container) =>
                        container.identifier === instance.containerIdentifier
                )!;

                visitedElements.add(instance.identifier!);
                visitedElements.add(instance.containerIdentifier);

                visitor.visitSupportingElement?.(container);
                visitor.visitSupportingElement?.(instance);
            });

            deploymentNode.deploymentNodes?.forEach(visitDeploymentNode);

            visitedElements.add(deploymentNode.identifier);
            return visitor.visitSupportingElement?.(deploymentNode);
        };

        // TODO(deployment): handle the deployment view scoped to a specific software system instance
        const visitDeploymentEnvironmentInScope = () => {
            this.model.deploymentEnvironments
                .filter(
                    (deploymentEnvironment) =>
                        deploymentEnvironment.name === this.view.environment
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
                    isRelationshipBetweenElementsInView(
                        visitedElements,
                        relationship
                    )
                )
                .forEach((relationship) =>
                    visitor.visitRelationship?.(relationship)
                );
        };

        visitDeploymentEnvironmentInScope();
        visitRelationshipArray(relationships);
    }
}
