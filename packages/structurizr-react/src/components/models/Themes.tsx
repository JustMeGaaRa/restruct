import { FC, useEffect } from "react";
import { ITheme } from "@structurizr/dsl";
import { useThemes } from "../../containers";

export const Styles: FC<{
    value: Pick<ITheme, "elements" | "relationships">;
}> = ({ value }) => {
    const { applyStyles } = useThemes();

    useEffect(() => {
        applyStyles(value);
    }, [applyStyles, value]);

    return null;
};

export const Themes: FC<{ url?: string | string[] }> = ({ url }) => {
    const { applyThemes } = useThemes();

    const urlArray = Array.isArray(url) ? url : url ? [url] : [];
    const urlsString = urlArray.join(",");

    useEffect(() => {
        if (!urlsString) {
            applyThemes([]);
            return;
        }

        const fetchTheme = (themeUrl: string) => {
            return fetch(themeUrl)
                .then((response) => response.json())
                .then((theme) => theme as ITheme);
        };

        Promise.all(urlsString.split(",").map(fetchTheme))
            .then((themes) => applyThemes(themes))
            .catch((error) => console.error("Failed to fetch theme", error));
    }, [applyThemes, urlsString]);

    return null;
};
