import {
    IDeploymentEnvironment,
    IDeploymentNode,
    IRelationship,
} from "../../interfaces";
import { BuilderCallback, IBuilder } from "../../shared";
import { DeploymentEnvironment } from "../DeploymentEnvironment";
import { Relationship } from "../Relationship";
import { DeploymentNodeBuilder } from "./DeploymentNodeBuilder";

export class DeploymentEnvironmentBuilder
    implements IBuilder<IDeploymentEnvironment>
{
    private deploymentEnvironment: IDeploymentEnvironment;

    constructor(name: string) {
        this.deploymentEnvironment = new DeploymentEnvironment({
            name,
            deploymentNodes: [],
            relationships: [],
        }).toSnapshot();
    }

    deploymentNode(
        name: string,
        callback: BuilderCallback<DeploymentNodeBuilder>
    ): IDeploymentNode {
        const deploymentNodeBuilder = new DeploymentNodeBuilder(name);
        callback(deploymentNodeBuilder);
        const deploymentNode = deploymentNodeBuilder.build();
        this.deploymentEnvironment.deploymentNodes.push(deploymentNode);
        return deploymentNode;
    }

    uses(source: string, target: string, description?: string): IRelationship {
        const relationship = new Relationship({
            sourceIdentifier: source,
            targetIdentifier: target,
            description,
        }).toSnapshot();
        this.deploymentEnvironment.relationships.push(relationship);
        return relationship;
    }

    build(): IDeploymentEnvironment {
        return this.deploymentEnvironment;
    }
}
