import { useMemo } from "react";
import {
    IElementStyle,
    IRelationshipStyle,
    ITag,
    mergeStyles,
} from "@structurizr/dsl";
import { useThemes } from "../containers";

export const useThemeResolvedElementStyle = (
    tags: ITag[] = []
): Partial<IElementStyle> => {
    const { defaultTheme, themes, styles: inlineStyles } = useThemes();

    return useMemo(() => {
        const styleCollection = [
            defaultTheme.elements,
            ...themes.map((t) => t.elements),
            inlineStyles?.elements ?? [],
        ];
        return styleCollection.reduce(
            (acc, styles) => mergeStyles(acc, styles, tags),
            {} as Partial<IElementStyle>
        );
    }, [tags, defaultTheme, themes, inlineStyles]);
};

export const useThemeResolvedRelationshipStyle = (
    tags: ITag[] = []
): Partial<IRelationshipStyle> => {
    const { defaultTheme, themes, styles: inlineStyles } = useThemes();

    return useMemo(() => {
        const styleCollection = [
            defaultTheme.relationships,
            ...themes.map((t) => t.relationships),
            inlineStyles?.relationships ?? [],
        ];
        return styleCollection.reduce(
            (acc, styles) => mergeStyles(acc, styles, tags),
            {} as Partial<IRelationshipStyle>
        );
    }, [tags, defaultTheme, themes, inlineStyles]);
};
