import { ElementType } from "./ElementType";
import { IHealthCheck } from "./IHealthCheck";
import { Properties } from "./Properties";
import { IRelationship } from "./IRelationship";
import { ITag } from "./ITag";
import { Identifier } from "./Identifier";
import { Perspectives } from "./Perspectives";
import { Url } from "./Url";

export interface ISoftwareSystemInstance {
    type: ElementType.SoftwareSystemInstance;
    identifier: string;
    softwareSystemIdentifier: string;
    deploymentGroups?: Identifier[];
    relationships?: IRelationship[];
    description?: string;
    tags?: ITag[];
    url?: Url;
    properties?: Properties;
    perspectives?: Perspectives;
    healthCheck?: IHealthCheck;
}
