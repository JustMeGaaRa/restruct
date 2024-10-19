import { ElementType } from "./ElementType";
import { ITag } from "./ITag";

export interface IElement {
    identifier: string;
    type: ElementType;
    name: string;
    description?: string;
    technology?: string[];
    tags: ITag[];
}
