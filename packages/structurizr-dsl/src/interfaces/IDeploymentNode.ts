import { ElementType } from "./ElementType";
import { Properties } from "./Properties";
import { Url } from "./Url";
import { ITag } from "./ITag";
import { Perspectives } from "./Perspectives";
import { IRelationship } from "./IRelationship";
import { IInfrastructureNode } from "./IInfrastructureNode";
import { ISoftwareSystemInstance } from "./ISoftwareSystemInstance";
import { IContainerInstance } from "./IContainerInstance";

export interface IDeploymentNode {
    type: ElementType.DeploymentNode;
    identifier: string;
    name: string;
    deploymentNodes: IDeploymentNode[];
    infrastructureNodes: IInfrastructureNode[];
    softwareSystemInstances: ISoftwareSystemInstance[];
    containerInstances: IContainerInstance[];
    technology: string[];
    description?: string;
    instances?: number;
    tags: ITag[];
    url?: Url;
    properties?: Properties;
    perspectives?: Perspectives;
    relationships: IRelationship[];
}
