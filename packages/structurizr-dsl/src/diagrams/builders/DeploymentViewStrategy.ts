import { IDeploymentNode, IDeploymentView, IModel } from "../../interfaces";
import { IElementVisitor, ISupportVisitor } from "../../shared";
import {
    getRelationships,
    relationshipExistsForElementsInView,
} from "../../utils";

export class DeploymentViewStrategy implements ISupportVisitor {
    constructor(
        private readonly model: IModel,
        private readonly view: IDeploymentView
    ) {}

    accept<T>(visitor: IElementVisitor<T>): Array<T> {
        const visitedElements = new Set<string>();
        const relationships = getRelationships(this.model, true);
        const softwareSystems = this.model.softwareSystems.concat(
            this.model.groups.flatMap((x) => x.softwareSystems)
        );
        const containers = softwareSystems
            .flatMap((x) => x.groups.flatMap((y) => y.containers))
            .concat(softwareSystems.flatMap((x) => x.containers));

        const visitDeploymentNode = (
            deploymentNode: IDeploymentNode,
            parentId?: string
        ): T => {
            const visitedInfrastructureNodes =
                deploymentNode.infrastructureNodes?.map(
                    (infrastructureNode) => {
                        visitedElements.add(infrastructureNode.identifier);
                        return visitor.visitInfrastructureNode(
                            infrastructureNode,
                            { parentId: deploymentNode.identifier }
                        );
                    }
                );

            const visitedSoftwareSystemInstances =
                deploymentNode.softwareSystemInstances?.map(
                    (softwareSystemInstance) => {
                        const softwareSystem = softwareSystems.find(
                            (softwareSystem) =>
                                softwareSystem.identifier ===
                                softwareSystemInstance.softwareSystemIdentifier
                        )!;
                        const visitedSoftwareSystem =
                            visitor.visitSoftwareSystem(softwareSystem);

                        visitedElements.add(softwareSystemInstance.identifier!);
                        visitedElements.add(softwareSystem.identifier);
                        return visitor.visitSoftwareSystemInstance(
                            softwareSystemInstance,
                            {
                                parentId: deploymentNode.identifier,
                                children: [visitedSoftwareSystem],
                            }
                        );
                    }
                );

            const visitedContainerInstances =
                deploymentNode.containerInstances?.map((containerInstance) => {
                    const container = containers.find(
                        (container) =>
                            container.identifier ===
                            containerInstance.containerIdentifier
                    )!;
                    const visitedContainer = visitor.visitContainer(container);

                    visitedElements.add(containerInstance.identifier!);
                    visitedElements.add(container.identifier);
                    return visitor.visitContainerInstance(containerInstance, {
                        parentId: deploymentNode.identifier,
                        children: [visitedContainer],
                    });
                });

            const visistedDeploymentNodes = deploymentNode.deploymentNodes?.map(
                (subNode) => {
                    visitedElements.add(subNode.identifier);
                    return visitDeploymentNode(
                        subNode,
                        deploymentNode.identifier
                    );
                }
            );

            visitedElements.add(deploymentNode.identifier);
            const children = visitedInfrastructureNodes
                .concat(visitedSoftwareSystemInstances)
                .concat(visitedContainerInstances)
                .concat(visistedDeploymentNodes);

            return visitor.visitDeploymentNode(deploymentNode, {
                parentId,
                children,
            });
        };

        // TODO: handle the deployment view scoped to a specific software system instance
        const visitedDeploymentEnvironment = this.model.deploymentEnvironments
            .filter(
                (deploymentEnvironment) =>
                    deploymentEnvironment.name === this.view.environment
            )
            .flatMap((deploymentEnvironment) => {
                return deploymentEnvironment.deploymentNodes.map(
                    (deploymentNode) => {
                        return visitDeploymentNode(deploymentNode);
                    }
                );
            });

        const visitedRelationships = relationships
            .filter((relationship) =>
                relationshipExistsForElementsInView(
                    Array.from(visitedElements),
                    relationship
                )
            )
            .map((relationship) => visitor.visitRelationship(relationship));
        return visitedDeploymentEnvironment.concat(visitedRelationships);
    }
}
