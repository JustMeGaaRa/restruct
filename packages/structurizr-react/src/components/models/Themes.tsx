import {
    FC,
    useCallback,
    useContext,
    useEffect,
} from "react";
import { StyleProps, Theme, ThemesContext } from "../../containers";

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
