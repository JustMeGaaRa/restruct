import { Identifier } from "./Identifier";
import { DeploymentGroup } from "./DeploymentGroup";
import { IRelationship } from "./IRelationship";
import { IDeploymentNode } from "./IDeploymentNode";

export interface IDeploymentEnvironment {
    identifier: Identifier;
    name: string;
    deploymentGroups: DeploymentGroup[];
    deploymentNodes: IDeploymentNode[];
    relationships: IRelationship[];
}
