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

    private idPath: string;

    constructor(name: string, parentPath: string = "") {
        this.idPath = parentPath ? `${parentPath}/DeploymentEnvironment:${name}` : `DeploymentEnvironment:${name}`;
        this.deploymentEnvironment = new DeploymentEnvironment({
            identifier: this.idPath,
            name,
            deploymentNodes: [],
            relationships: [],
        }).toSnapshot();
    }

    deploymentNode(
        name: string,
        callback: BuilderCallback<DeploymentNodeBuilder>
    ): IDeploymentNode {
        const deploymentNodeBuilder = new DeploymentNodeBuilder(name, this.idPath);
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
