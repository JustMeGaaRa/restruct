import { ElementType } from "./ElementType";
import { ITag } from "./ITag";

export interface IElement {
    identifier: string;
    type: ElementType | string;
    name: string;
    description?: string;
    technology?: string[];
    tags: ITag[];
}
