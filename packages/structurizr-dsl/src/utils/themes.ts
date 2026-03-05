import { IWorkspace, ITheme, ITag } from "../interfaces";
import { Style } from "../models";

export function mergeStyles<
    TStyleProperties extends Record<string, unknown>,
    TTagStyle extends Style<TStyleProperties>,
>(
    targetStyle: TStyleProperties,
    tagStyleCollection: Array<TTagStyle>,
    tags: Array<ITag>
): TStyleProperties {
    const applyTagStyle = (
        targetStyle: TStyleProperties,
        tagStyle?: Partial<TStyleProperties>
    ) => {
        return tagStyle
            ? (Object.fromEntries(
                  Object.entries({ ...targetStyle, ...tagStyle }).map(
                      ([key, value]) => [
                          key,
                          value !== undefined ? value : targetStyle[key],
                      ]
                  )
              ) as TStyleProperties)
            : targetStyle;
    };

    return tags
        ? tags.reduce((aggregatedStyle, tag) => {
              const tagStyle = tagStyleCollection.find(
                  (x) => x.tag === tag.name
              );
              return applyTagStyle(aggregatedStyle, tagStyle);
          }, targetStyle)
        : targetStyle;
}

export const applyTheme = (
    workspace: IWorkspace,
    theme: ITheme
): IWorkspace => {
    const inlineElementStyles = workspace.views.configuration.styles.elements;
    const inlineRelationshipStyles =
        workspace.views.configuration.styles.relationships;

    return {
        ...workspace,
        views: {
            ...workspace.views,
            configuration: {
                ...workspace.views.configuration,
                styles: {
                    ...workspace.views.configuration.styles,
                    elements: inlineElementStyles.concat(theme.elements ?? []),
                    relationships: inlineRelationshipStyles.concat(
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
