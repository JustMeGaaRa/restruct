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

    private idPath: string;

    constructor(name: string, parentPath: string = "") {
        this.idPath = parentPath ? `${parentPath}/DeploymentNode:${name}` : `DeploymentNode:${name}`;
        this.node = new DeploymentNode({
            identifier: this.idPath,
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
        const deploymentNodeBuilder = new DeploymentNodeBuilder(name, this.idPath);
        callback?.(deploymentNodeBuilder);
        const deploymentNode = deploymentNodeBuilder.build();
        this.node.deploymentNodes.push(deploymentNode);
        return deploymentNode;
    }

    infrastructureNode(name: string, description: string): IInfrastructureNode {
        const identifier = `${this.idPath}/InfrastructureNode:${name}`;
        const infrastructureNode = new InfrastructureNode({
            identifier,
            name,
            description,
        }).toSnapshot();
        this.node.infrastructureNodes.push(infrastructureNode);
        return infrastructureNode;
    }

    softwareSystemInstance(
        softwareSystemIdentifier: string
    ): ISoftwareSystemInstance {
        const identifier = `${this.idPath}/SoftwareSystemInstance:${softwareSystemIdentifier}`;
        const softwareSystemInstance = new SoftwareSystemInstance({
            identifier,
            softwareSystemIdentifier: softwareSystemIdentifier,
        }).toSnapshot();
        this.node.softwareSystemInstances.push(softwareSystemInstance);
        return softwareSystemInstance;
    }

    containerInstance(containerIdentifier: string): IContainerInstance {
        const identifier = `${this.idPath}/ContainerInstance:${containerIdentifier}`;
        const containerInstance = new ContainerInstance({
            identifier,
            containerIdentifier: containerIdentifier,
        }).toSnapshot();
        this.node.containerInstances.push(containerInstance);
        return containerInstance;
    }

    build(): IDeploymentNode {
        return this.node;
    }
}
