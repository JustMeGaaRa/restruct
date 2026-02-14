import js from "@eslint/js";
import globals from "globals";
import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginReactRefresh from "eslint-plugin-react-refresh";
import pluginReact from "eslint-plugin-react";
import tseslint from "typescript-eslint";

export default tseslint.config(
    {
        extends: [js.configs.recommended, ...tseslint.configs.recommended],
        files: ["**/*.{ts,tsx}"],
        languageOptions: {
            ...pluginReact.configs.flat.recommended.languageOptions,
            ecmaVersion: 2020,
            globals: globals.browser,
        },
        plugins: {
            "react-hooks": pluginReactHooks,
            "react-refresh": pluginReactRefresh,
        },
        settings: { react: { version: "detect" } },
        rules: {
            ...pluginReactHooks.configs.recommended.rules,
            "react-refresh/only-export-components": [
                "warn",
                { allowConstantExport: true },
            ],
        },
    },
    { ignores: ["dist"] }
);
