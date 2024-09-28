import { ElementType } from "./ElementType";
import { ITag } from "./ITag";
import { Identifier } from "./Identifier";

export interface IElement {
    identifier: Identifier;
    type: ElementType;
    name: string;
    description?: string;
    technology?: string[];
    tags: ITag[];
}
