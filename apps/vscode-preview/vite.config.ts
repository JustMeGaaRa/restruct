import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    build: {
        outDir: "../vscode-extension/media",
        emptyOutDir: true,
        rolldownOptions: {
            output: {
                entryFileNames: "assets/[name].js",
                chunkFileNames: "assets/[name].js",
                assetFileNames: "assets/[name].[ext]",
            },
        },
    },
    resolve: {
        tsconfigPaths: true,
        alias: {
            "@": path.resolve(__dirname, "src"),
            "@restruct/structurizr-dsl": path.resolve(
                __dirname,
                "../../packages/structurizr-dsl/src/index.ts"
            ),
            "@restruct/structurizr-react": path.resolve(
                __dirname,
                "../../packages/structurizr-react/src/index.ts"
            ),
            "@restruct/react-svg": path.resolve(
                __dirname,
                "../../packages/graph-svg/src/index.ts"
            ),
            "@restruct/ui": path.resolve(
                __dirname,
                "../../packages/ui/src/index.ts"
            ),
        },
    },
});
