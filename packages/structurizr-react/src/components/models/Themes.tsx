import {
    createContext,
    Dispatch,
    FC,
    PropsWithChildren,
    SetStateAction,
    useCallback,
    useContext,
    useEffect,
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

export const Styles: FC<{ value: StyleProps }> = ({ value }) => {
    const { applyStyles } = useThemes();

    useEffect(() => {
        applyStyles(value);
    }, [applyStyles, value]);

    return null;
};

export const Themes: FC<{ urls: Array<string> }> = ({ urls }) => {
    const { applyThemes } = useThemes();

    useEffect(() => {
        const fetchTheme = (url: string) => {
            return fetch(url)
                .then(response => response.json())
                .then(theme => theme as Theme)
        };

        Promise.all(urls.map(fetchTheme))
            .then(themes => applyThemes(themes))
            .catch(error => console.error("Failed to fetch theme", error));
    }, [applyThemes, urls]);

    return null;
};

export const useThemes = () => {
    const { theme, styles, themes, setThemes, setStyles } = useContext(ThemesContext);

    const applyStyles = useCallback((styles: StyleProps) => {
        setStyles(styles);
    }, [setStyles]);

    const applyThemes = useCallback((themes: Array<Theme>) => {
        setThemes(themes);
    }, [setThemes]);

    return {
        theme,
        styles,
        themes,
        applyStyles,
        applyThemes
    }
};
