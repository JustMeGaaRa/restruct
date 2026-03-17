import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
    title: "re:struct",
    tagline:
        "The Architecture-as-Code SDK for modern systems. Define, visualize, and scale your technical design with TypeScript primitives and a developer-first toolchain.",
    favicon: "img/favicon.svg",

    // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
    future: {
        v4: true, // Improve compatibility with the upcoming Docusaurus v4
    },

    // Set the production url of your site here
    url: "https://docs.restructapp.dev",
    // Set the /<baseUrl>/ pathname under which your site is served
    // For GitHub pages deployment, it is often '/<projectName>/'
    baseUrl: "/",

    // GitHub pages deployment config.
    // If you aren't using GitHub pages, you don't need these.
    organizationName: "JustMeGaaRa", // Usually your GitHub org/user name.
    projectName: "restruct", // Usually your repo name.

    onBrokenLinks: "throw",

    // Even if you don't use internationalization, you can use this field to set
    // useful metadata like html lang. For example, if your site is Chinese, you
    // may want to replace "en" with "zh-Hans".
    i18n: {
        defaultLocale: "en",
        locales: ["en"],
    },

    presets: [
        [
            "classic",
            {
                docs: {
                    sidebarPath: "./sidebars.ts",
                    // Please change this to your repo.
                    // Remove this to remove the "edit this page" links.
                    editUrl:
                        "https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/",
                },
                theme: {
                    customCss: "./src/css/custom.css",
                },
            } satisfies Preset.Options,
        ],
    ],

    themeConfig: {
        // Replace with your project's social card
        image: "img/docusaurus-social-card.jpg",
        colorMode: {
            respectPrefersColorScheme: true,
        },
        navbar: {
            title: "re:struct",
            logo: {
                alt: "re:struct",
                src: "img/logo.svg",
            },
            items: [
                {
                    type: "docSidebar",
                    sidebarId: "dslSidebar",
                    position: "left",
                    label: "DSL",
                },
                // {
                //     type: "docSidebar",
                //     sidebarId: "reactSidebar",
                //     position: "left",
                //     label: "React",
                // },
                {
                    type: "docSidebar",
                    sidebarId: "cliSidebar",
                    position: "left",
                    label: "CLI",
                },
                {
                    href: "https://github.com/JustMeGaaRa/restruct",
                    label: "GitHub",
                    position: "right",
                },
            ],
        },
        footer: {
            style: "dark",
            links: [
                {
                    title: "Docs",
                    items: [
                        {
                            label: "DSL",
                            to: "/docs/dsl/quickstart",
                        },
                        {
                            label: "CLI",
                            to: "/docs/cli/quickstart",
                        },
                        {
                            label: "React",
                            to: "/docs/react/quickstart",
                        },
                    ],
                },
                {
                    title: "More",
                    items: [
                        {
                            label: "GitHub",
                            href: "https://github.com/JustMeGaaRa/restruct",
                        },
                        {
                            label: "MIT License",
                            href: "https://github.com/JustMeGaaRa/restruct/blob/main/LICENSE",
                        },
                    ],
                },
            ],
            copyright: `© ${new Date().getFullYear()} re:struct. Built with Docusaurus.`,
        },
        prism: {
            theme: prismThemes.github,
            darkTheme: prismThemes.dracula,
        },
    } satisfies Preset.ThemeConfig,
};

export default config;
