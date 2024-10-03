import { DeploymentGroup } from "./DeploymentGroup";
import { IRelationship } from "./IRelationship";
import { IDeploymentNode } from "./IDeploymentNode";

export interface IDeploymentEnvironment {
    identifier: string;
    name: string;
    deploymentGroups: DeploymentGroup[];
    deploymentNodes: IDeploymentNode[];
    relationships: IRelationship[];
}
