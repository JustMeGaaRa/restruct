import {
    IContainerInstance,
    IDeploymentNode,
    IInfrastructureNode,
    ISoftwareSystemInstance,
    Identifier,
} from "../../interfaces";
import { BuilderCallback, IBuilder } from "../../shared";
import { ContainerInstance } from "../ContainerInstance";
import { DeploymentNode } from "../DeploymentNode";
import { InfrastructureNode } from "../InfrastructureNode";
import { SoftwareSystemInstance } from "../SoftwareSystemInstance";

export class DeploymentNodeBuilder implements IBuilder<IDeploymentNode> {
    private node: IDeploymentNode;

    constructor(name: string) {
        this.node = new DeploymentNode({
            name,
            deploymentNodes: [],
            infrastructureNodes: [],
            softwareSystemInstances: [],
            containerInstances: [],
            relationships: [],
        }).toSnapshot();
    }

    deploymentNode(
        name: string,
        callback?: BuilderCallback<DeploymentNodeBuilder>
    ): IDeploymentNode {
        const deploymentNodeBuilder = new DeploymentNodeBuilder(name);
        callback?.(deploymentNodeBuilder);
        const deploymentNode = deploymentNodeBuilder.build();
        this.node.deploymentNodes.push(deploymentNode);
        return deploymentNode;
    }

    infrastructureNode(name: string, description: string): IInfrastructureNode {
        const infrastructureNode = new InfrastructureNode({
            name,
            description,
        }).toSnapshot();
        this.node.infrastructureNodes.push(infrastructureNode);
        return infrastructureNode;
    }

    softwareSystemInstance(
        softwareSystemIdentifier: string
    ): ISoftwareSystemInstance {
        const softwareSystemInstance = new SoftwareSystemInstance({
            softwareSystemIdentifier: softwareSystemIdentifier,
        }).toSnapshot();
        this.node.softwareSystemInstances.push(softwareSystemInstance);
        return softwareSystemInstance;
    }

    containerInstance(containerIdentifier: string): IContainerInstance {
        const containerInstance = new ContainerInstance({
            containerIdentifier: containerIdentifier,
        }).toSnapshot();
        this.node.containerInstances.push(containerInstance);
        return containerInstance;
    }

    build(): IDeploymentNode {
        return this.node;
    }
}
