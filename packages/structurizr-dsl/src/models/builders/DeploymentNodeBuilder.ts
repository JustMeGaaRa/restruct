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
            // TODO: generate an identifier
            identifier: "",
            name,
            deploymentNodes: [],
            infrastructureNodes: [],
            softwareSystemInstances: [],
            containerInstances: [],
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
            // TODO: generate an identifier
            identifier: "",
            name,
            description,
        }).toSnapshot();
        this.node.infrastructureNodes.push(infrastructureNode);
        return infrastructureNode;
    }

    softwareSystemInstance(
        softwareSystemIdentifier: Identifier
    ): ISoftwareSystemInstance {
        const softwareSystemInstance = new SoftwareSystemInstance({
            // TODO: generate an identifier
            identifier: "",
            softwareSystemIdentifier,
        }).toSnapshot();
        this.node.softwareSystemInstances.push(softwareSystemInstance);
        return softwareSystemInstance;
    }

    containerInstance(containerIdentifier: Identifier): IContainerInstance {
        const containerInstance = new ContainerInstance({
            // TODO: generate an identifier
            identifier: "",
            containerIdentifier,
        }).toSnapshot();
        this.node.containerInstances.push(containerInstance);
        return containerInstance;
    }

    build(): IDeploymentNode {
        return this.node;
    }
}
