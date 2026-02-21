import { ITheme } from "@structurizr/dsl";
import {
    createContext,
    Dispatch,
    FC,
    PropsWithChildren,
    SetStateAction,
    useCallback,
    useContext,
    useState,
} from "react";
import { RestructDarkTheme } from "../types";

export const ThemesContext = createContext<{
    theme?: ITheme | null;
    styles?: Pick<ITheme, "elements" | "relationships">;
    themes: Array<ITheme>;
    setTheme: Dispatch<SetStateAction<ITheme | undefined>>;
    setStyles: Dispatch<
        SetStateAction<Pick<ITheme, "elements" | "relationships"> | undefined>
    >;
    setThemes: Dispatch<SetStateAction<Array<ITheme>>>;
}>({
    theme: undefined,
    styles: undefined,
    themes: [],
    setTheme: () => {
        console.debug("Themes Context: dummy setTheme");
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
        theme?: ITheme;
    }>
> = ({ children, theme: originalTheme }) => {
    const [theme, setTheme] = useState<ITheme | undefined>(
        originalTheme ?? RestructDarkTheme
    );
    const [styles, setStyles] = useState<
        Pick<ITheme, "elements" | "relationships"> | undefined
    >();
    const [themes, setThemes] = useState<Array<ITheme>>([]);

    return (
        <ThemesContext.Provider
            value={{
                theme,
                styles,
                themes,
                setTheme,
                setStyles,
                setThemes,
            }}
        >
            {children}
        </ThemesContext.Provider>
    );
};

export const useThemes = () => {
    const { theme, styles, themes, setThemes, setStyles } =
        useContext(ThemesContext);

    const applyStyles = useCallback(
        (styles: Pick<ITheme, "elements" | "relationships">) => {
            setStyles(styles);
        },
        [setStyles]
    );

    const applyThemes = useCallback(
        (themes: Array<ITheme>) => {
            setThemes(themes);
        },
        [setThemes]
    );

    return {
        theme,
        styles,
        themes,
        applyStyles,
        applyThemes,
    };
};
