import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
    plugins: [react(), tsconfigPaths()],
    root: __dirname,
    base: "./",
    build: {
        outDir: path.resolve(__dirname, "../dist/preview"),
        emptyOutDir: true,
        rollupOptions: {
            input: {
                main: path.join(__dirname, "index.html"),
            },
        },
    },
    resolve: {
        // Keep manual alias as backup/override
        alias: {
            "@": path.resolve(__dirname, "src"),
            "@structurizr/dsl": path.resolve(
                __dirname,
                "../../../packages/structurizr-dsl/src/index.ts"
            ),
            "@structurizr/react": path.resolve(
                __dirname,
                "../../../packages/structurizr-react/src/index.ts"
            ),
            "@graph/svg": path.resolve(
                __dirname,
                "../../../packages/graph-svg/src/index.ts"
            ),
            "@restruct/ui": path.resolve(
                __dirname,
                "../../../packages/ui/src/index.ts"
            ),
        },
    },
});
