import { IWorkspace, ITheme, ITag } from "../interfaces";
import { Style } from "../models";

export function foldStyles<
    TStyleProperties extends { [key: string]: unknown },
    TTagStyle extends Style<TStyleProperties>,
>(
    style: TStyleProperties,
    tagStyles: TTagStyle[],
    tags: ITag[]
): TStyleProperties {
    const applyStyle = (
        style: TStyleProperties,
        tagStyle: Partial<TStyleProperties>
    ) => {
        return Object.fromEntries(
            Object.entries({ ...style, ...tagStyle }).map(([key, value]) => [
                key,
                value !== undefined ? value : style[key],
            ])
        ) as TStyleProperties;
    };

    return tags
        ? tags.reduce((state, tag) => {
              const tagStyle = tagStyles.find((x) => x.tag === tag.name);
              return tagStyle ? applyStyle(state, tagStyle) : state;
          }, style)
        : style;
}

export const applyTheme = (
    workspace: IWorkspace,
    theme: ITheme
): IWorkspace => {
    const elements = workspace.views.configuration.styles.elements;
    const relationships = workspace.views.configuration.styles.relationships;

    return {
        ...workspace,
        views: {
            ...workspace.views,
            configuration: {
                ...workspace.views.configuration,
                styles: {
                    ...workspace.views.configuration.styles,
                    elements: elements.concat(theme.elements ?? []),
                    relationships: relationships.concat(
                        theme.relationships ?? []
                    ),
                },
            },
        },
    };
};

export const fetchTheme = async (url: string): Promise<ITheme> => {
    const themeResponse = await fetch(url);
    if (!themeResponse.ok) throw new Error(`Theme not found`);
    return (await themeResponse.json()) as ITheme;
};
