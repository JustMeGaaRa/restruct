import { ElementType } from "./ElementType";
import { Properties } from "./Properties";
import { Url } from "./Url";
import { ITag } from "./ITag";
import { Perspectives } from "./Perspectives";
import { IRelationship } from "./IRelationship";
import { IGroup } from "./IGroup";
import { IComponent } from "./IComponent";

export interface IContainer {
    type: ElementType.Container;
    identifier: string;
    name: string;
    groups: IGroup[];
    components: IComponent[];
    technology: string[];
    description?: string;
    tags: ITag[];
    url?: Url;
    properties?: Properties;
    perspectives?: Perspectives;
    relationships: IRelationship[];
}
