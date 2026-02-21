import { IElementStyle, IRelationshipStyle, ITheme } from "@structurizr/dsl";

export const resolveElementStyle = (
    tags: string[] = [],
    defaultTheme?: ITheme | null,
    themes: ITheme[] = [],
    inlineStyles?: Pick<ITheme, "elements" | "relationships">
): Partial<IElementStyle> => {
    let resolvedStyle: Partial<IElementStyle> = {};

    // 1. Default Theme base styles
    if (defaultTheme?.elements) {
        for (const tag of tags) {
            const style = defaultTheme.elements.find((s) => s.tag === tag);
            if (style) {
                resolvedStyle = { ...resolvedStyle, ...style };
            }
        }
    }

    // 2. Fetched Themes (in order)
    for (const theme of themes) {
        if (theme.elements) {
            for (const tag of tags) {
                const style = theme.elements.find((s) => s.tag === tag);
                if (style) {
                    resolvedStyle = { ...resolvedStyle, ...style };
                }
            }
        }
    }

    // 3. Inline Styles (overrides)
    if (inlineStyles?.elements) {
        for (const tag of tags) {
            const style = inlineStyles.elements.find((s) => s.tag === tag);
            if (style) {
                resolvedStyle = { ...resolvedStyle, ...style };
            }
        }
    }

    return resolvedStyle;
};

export const resolveRelationshipStyle = (
    tags: string[] = [],
    defaultTheme?: ITheme | null,
    themes: ITheme[] = [],
    inlineStyles?: Pick<ITheme, "elements" | "relationships">
): Partial<IRelationshipStyle> => {
    let resolvedStyle: Partial<IRelationshipStyle> = {};

    // 1. Default Theme base styles
    if (defaultTheme?.relationships) {
        for (const tag of tags) {
            const style = defaultTheme.relationships.find((s) => s.tag === tag);
            if (style) {
                resolvedStyle = { ...resolvedStyle, ...style };
            }
        }
    }

    // 2. Fetched Themes (in order)
    for (const theme of themes) {
        if (theme.relationships) {
            for (const tag of tags) {
                const style = theme.relationships.find((s) => s.tag === tag);
                if (style) {
                    resolvedStyle = { ...resolvedStyle, ...style };
                }
            }
        }
    }

    // 3. Inline Styles (overrides)
    if (inlineStyles?.relationships) {
        for (const tag of tags) {
            const style = inlineStyles.relationships.find((s) => s.tag === tag);
            if (style) {
                resolvedStyle = { ...resolvedStyle, ...style };
            }
        }
    }

    return resolvedStyle;
};
