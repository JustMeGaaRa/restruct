import { ElementType } from "./ElementType";
import { Properties } from "./Properties";
import { Url } from "./Url";
import { ITag } from "./ITag";
import { Perspectives } from "./Perspectives";
import { IRelationship } from "./IRelationship";
import { IHealthCheck } from "./IHealthCheck";
import { DeploymentGroup } from "./DeploymentGroup";

export interface IContainerInstance {
    type: ElementType.ContainerInstance;
    identifier: string;
    containerIdentifier: string;
    deploymentGroups?: DeploymentGroup[];
    relationships?: IRelationship[];
    description?: string;
    tags?: ITag[];
    url?: Url;
    properties?: Properties;
    perspectives?: Perspectives;
    healthCheck?: IHealthCheck;
}
