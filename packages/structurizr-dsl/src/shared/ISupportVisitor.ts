import { IElementVisitor } from "./IElementVisitor";

export interface ISupportVisitor {
    accept<T = any>(visitor: IElementVisitor<T>): Array<T>;
}
