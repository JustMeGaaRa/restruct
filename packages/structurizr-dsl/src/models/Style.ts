import { IElementStyle, IRelationshipStyle } from "../interfaces";

export class Styles {
    constructor(
        public readonly elements: ElementStyleCollection,
        public readonly relationships: RelationshipStyleCollection
    ) {}
}

export type Style<TProperties> = Partial<TProperties> & { tag: string };

export type ElementStyleCollection = Array<Style<IElementStyle>>;

export type RelationshipStyleCollection = Array<Style<IRelationshipStyle>>;
