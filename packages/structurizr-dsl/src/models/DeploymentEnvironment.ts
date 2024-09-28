import {
    DeploymentGroup,
    IDeploymentEnvironment,
    Identifier,
} from "../interfaces";
import { ISupportSnapshot } from "../shared";
import { DeploymentNode } from "./DeploymentNode";
import { Relationship } from "./Relationship";

type DeploymentEnvironmentParams = Required<
    Pick<IDeploymentEnvironment, "identifier" | "name" | "deploymentNodes">
> &
    Partial<
        Omit<
            IDeploymentEnvironment,
            "identifier" | "name" | "deploymentNodes" | "type"
        >
    >;

export class DeploymentEnvironment
    implements ISupportSnapshot<IDeploymentEnvironment>
{
    constructor(params: DeploymentEnvironmentParams) {
        this.identifier = params.identifier;
        this.name = params.name;
        this.deploymentGroups = params.deploymentGroups ?? [];
        this.deploymentNodes = params.deploymentNodes
            ? params.deploymentNodes.map((n) => new DeploymentNode(n))
            : [];
        this.relationships = params.relationships
            ? params.relationships.map((r) => new Relationship(r))
            : [];
    }

    public readonly identifier: Identifier;
    public readonly name: string;
    public readonly deploymentGroups: DeploymentGroup[];
    public readonly deploymentNodes: DeploymentNode[];
    public readonly relationships: Relationship[];

    public toSnapshot(): IDeploymentEnvironment {
        return {
            identifier: this.identifier,
            name: this.name,
            deploymentGroups: this.deploymentGroups,
            deploymentNodes: this.deploymentNodes.map((n) => n.toSnapshot()),
            relationships: this.relationships.map((r) => r.toSnapshot()),
        };
    }
}
