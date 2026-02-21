import { useMemo } from "react";
import { IElementStyle, IRelationshipStyle } from "@structurizr/dsl";
import { useThemes } from "../containers";
import {
    resolveElementStyle,
    resolveRelationshipStyle,
} from "../utils/themeResolver";
import { RestructDarkTheme } from "../types";

export const useThemeResolvedElementStyle = (
    tags: string[] = []
): Partial<IElementStyle> => {
    const { theme, themes, styles } = useThemes();

    return useMemo(() => {
        // Fallback to RestructDarkTheme if not provided
        const defaultTheme = theme ?? RestructDarkTheme;
        return resolveElementStyle(tags, defaultTheme, themes, styles);
    }, [tags, theme, themes, styles]);
};

export const useThemeResolvedRelationshipStyle = (
    tags: string[] = []
): Partial<IRelationshipStyle> => {
    const { theme, themes, styles } = useThemes();

    return useMemo(() => {
        const defaultTheme = theme ?? RestructDarkTheme;
        return resolveRelationshipStyle(tags, defaultTheme, themes, styles);
    }, [tags, theme, themes, styles]);
};
