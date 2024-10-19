import {
    createContext,
    Dispatch,
    FC,
    PropsWithChildren,
    SetStateAction,
    useState
} from "react";

export type StyleProps = {
    elements: any[];
    relationships: any[];
}

export type Theme = StyleProps & {
    name: string;
    description?: string;
};

export const ThemesContext = createContext<{
    theme: Theme | null;
    styles: StyleProps | null;
    themes: Array<Theme>;
    setTheme: Dispatch<SetStateAction<Theme | null>>;
    setStyles: Dispatch<SetStateAction<StyleProps | null>>;
    setThemes: Dispatch<SetStateAction<Array<Theme>>>;
}>({
    theme: null,
    styles: null,
    themes: [],
    setTheme: () => { console.debug("Themes Context: dummy setTheme") },
    setStyles: () => { console.debug("Themes Context: dummy setStyles") },
    setThemes: () => { console.debug("Themes Context: dummy setThemes") },
});

export const ThemeProvider: FC<PropsWithChildren> = ({ children }) => {
    const [theme, setTheme] = useState<Theme | null>(null);
    const [styles, setStyles] = useState<StyleProps | null>(null);
    const [themes, setThemes] = useState<Array<Theme>>([]);

    return (
        <ThemesContext.Provider
            value={{
                theme,
                styles,
                themes,
                setTheme,
                setStyles,
                setThemes
            }}
        >
            {children}
        </ThemesContext.Provider>
    );
};