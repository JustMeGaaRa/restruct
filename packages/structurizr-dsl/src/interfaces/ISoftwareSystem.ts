import { ElementType } from "./ElementType";
import { IContainer } from "./IContainer";
import { IGroup } from "./IGroup";
import { Properties } from "./Properties";
import { IRelationship } from "./IRelationship";
import { ITag } from "./ITag";
import { Perspectives } from "./Perspectives";
import { Url } from "./Url";

export interface ISoftwareSystem {
    type: ElementType.SoftwareSystem;
    identifier: string;
    name: string;
    groups: IGroup[];
    containers: IContainer[];
    description?: string;
    tags: ITag[];
    url?: Url;
    properties?: Properties;
    perspectives?: Perspectives;
    relationships: IRelationship[];
}
