import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), tsconfigPaths()],
    build: {
        outDir: "../vscode-extension/media",
        emptyOutDir: true,
        rollupOptions: {
            output: {
                entryFileNames: "assets/[name].js",
                chunkFileNames: "assets/[name].js",
                assetFileNames: "assets/[name].[ext]",
            },
        },
    },
    resolve: {
        // Keep manual alias as backup/override
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
