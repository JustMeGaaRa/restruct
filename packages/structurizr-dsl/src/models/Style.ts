import { IElementStyle, IRelationshipStyle } from "../interfaces";

/**
 * @description A collection of styles for elements and relationships within a theme.
 * @example
 * ```typescript
 * const styles: Styles = {
 *     elements: [
 *         { tag: "Person", background: "#ffffff" },
 *         { tag: "SoftwareSystem", background: "#aabbcc" },
 *     ],
 *     relationships: [
 *         { tag: "Relationship", thickness: 2 },
 *         { tag: "Asynchronous", style: "dashed" },
 *     ],
 * };
 * ```
 */
export class Styles {
    constructor(
        public readonly elements: ElementStyleCollection,
        public readonly relationships: RelationshipStyleCollection
    ) {}
}

/**
 * @description A style for an element or relationship within a theme.
 * @example
 * ```typescript
 * const style: Style<IElementStyle> = { tag: "Person", background: "#ffffff" };
 * ```
 */
export type Style<TProperties> = Partial<TProperties> & { tag: string };

/**
 * @description A set of styles for elements within a theme.
 * @example
 * ```typescript
 * const styles: ElementStyleCollection = [
 *     { tag: "Person", background: "#ffffff" },
 *     { tag: "SoftwareSystem", background: "#aabbcc" },
 * ];
 * ```
 */
export type ElementStyleCollection = Array<Style<IElementStyle>>;

/**
 * @description A set of styles for relationships within a theme.
 * @example
 * ```typescript
 * const styles: RelationshipStyleCollection = [
 *     { tag: "Relationship", thickness: 2 },
 *     { tag: "Asynchronous", style: "dashed" },
 * ];
 * ```
 */
export type RelationshipStyleCollection = Array<Style<IRelationshipStyle>>;
