import {
    IElementStyle,
    IRelationshipStyle,
    ITag,
    ITheme,
    mergeStyles,
} from "@restruct/structurizr-dsl";
import {
    createContext,
    Dispatch,
    FC,
    PropsWithChildren,
    SetStateAction,
    useContext,
    useMemo,
    useState,
} from "react";
import { RestructDarkTheme } from "../types";

export const ThemesContext = createContext<{
    defaultTheme: ITheme;
    styles?: Pick<ITheme, "elements" | "relationships">;
    themes: Array<ITheme>;
    setDefaultTheme: Dispatch<SetStateAction<ITheme>>;
    setStyles: Dispatch<
        SetStateAction<Pick<ITheme, "elements" | "relationships"> | undefined>
    >;
    setThemes: Dispatch<SetStateAction<Array<ITheme>>>;
}>({
    defaultTheme: RestructDarkTheme,
    styles: undefined,
    themes: [],
    setDefaultTheme: () => {
        console.debug("Themes Context: dummy setDefaultTheme");
    },
    setStyles: () => {
        console.debug("Themes Context: dummy setStyles");
    },
    setThemes: () => {
        console.debug("Themes Context: dummy setThemes");
    },
});

export const ThemeProvider: FC<
    PropsWithChildren<{
        defaultTheme: ITheme;
    }>
> = ({ children, defaultTheme }) => {
    const [theme, setTheme] = useState<ITheme>(defaultTheme);
    const [styles, setStyles] = useState<
        Pick<ITheme, "elements" | "relationships"> | undefined
    >();
    const [themes, setThemes] = useState<Array<ITheme>>([]);

    return (
        <ThemesContext.Provider
            value={{
                defaultTheme: theme,
                styles,
                themes,
                setDefaultTheme: setTheme,
                setStyles,
                setThemes,
            }}
        >
            {children}
        </ThemesContext.Provider>
    );
};

export const useThemes = () => {
    const { defaultTheme, styles, themes, setThemes, setStyles } =
        useContext(ThemesContext);

    return {
        defaultTheme,
        styles,
        themes,
        setStyles,
        setThemes,
    };
};

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
