import { IElementVisitor } from "./IElementVisitor";

export interface ISupportElementVisitor<TElement> {
    accept(visitor: IElementVisitor<TElement>): void;
}
