import { IElementStyle, IRelationshipStyle, IStyles } from "../../interfaces";
import { IBuilder } from "../../shared";
import { Style, Styles } from "../Style";

export class StylesBuilder implements IBuilder<IStyles> {
    private styles: IStyles;

    constructor() {
        this.styles = {
            elements: [],
            relationships: [],
        };
    }

    element(tag: string, props: Partial<IElementStyle>): Style<IElementStyle> {
        const style = {
            tag,
            ...props,
        };
        this.styles.elements.push(style);
        return style;
    }

    relationship(
        tag: string,
        props: Partial<IRelationshipStyle>
    ): Style<IRelationshipStyle> {
        const style = {
            tag,
            ...props,
        };
        this.styles.relationships.push(style);
        return style;
    }

    build(): Styles {
        return {
            elements: this.styles.elements,
            relationships: this.styles.relationships,
        };
    }
}
