import { FC, useEffect } from "react";
import { ITheme } from "@structurizr/dsl"
import { useThemes } from "../../containers";

export const Styles: FC<{ value: Pick<ITheme, "elements" | "relationships"> }> = ({ value }) => {
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
                .then(theme => theme as ITheme)
        };

        Promise.all(urls.map(fetchTheme))
            .then(themes => applyThemes(themes))
            .catch(error => console.error("Failed to fetch theme", error));
    }, [applyThemes, urls]);

    return null;
};
