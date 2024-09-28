import { ElementType } from "./ElementType";
import { Properties } from "./Properties";
import { IRelationship } from "./IRelationship";
import { ITag } from "./ITag";
import { Identifier } from "./Identifier";
import { Perspectives } from "./Perspectives";
import { Url } from "./Url";

export interface IPerson {
    type: ElementType.Person;
    identifier: Identifier;
    name: string;
    tags: ITag[];
    description?: string;
    url?: Url;
    properties?: Properties;
    perspectives?: Perspectives;
    relationships: IRelationship[];
}
