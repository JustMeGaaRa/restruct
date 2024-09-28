import { Identifier } from "./Identifier";
import { ElementType } from "./ElementType";
import { Properties } from "./Properties";
import { Url } from "./Url";
import { ITag } from "./ITag";
import { Perspectives } from "./Perspectives";
import { IRelationship } from "./IRelationship";

export interface IInfrastructureNode {
    type: ElementType.InfrastructureNode;
    identifier: Identifier;
    name: string;
    description?: string;
    technology?: string[];
    tags: ITag[];
    url?: Url;
    properties?: Properties;
    perspectives?: Perspectives;
    relationships: IRelationship[];
}
