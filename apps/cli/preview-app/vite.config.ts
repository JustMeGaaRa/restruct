import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
    plugins: [react()],
    root: __dirname,
    base: "./",
    build: {
        outDir: path.resolve(__dirname, "../dist/preview"),
        emptyOutDir: true,
        rolldownOptions: {
            input: {
                main: path.join(__dirname, "index.html"),
            },
        },
    },
    resolve: {
        tsconfigPaths: true,
        dedupe: ["react", "react-dom", "@chakra-ui/react"],
        alias: {
            "@": path.resolve(__dirname, "src"),
            "@restruct/structurizr-dsl": path.resolve(
                __dirname,
                "../../../packages/structurizr-dsl/src/index.ts"
            ),
            "@restruct/structurizr-react": path.resolve(
                __dirname,
                "../../../packages/structurizr-react/src/index.ts"
            ),
            "@restruct/react-svg": path.resolve(
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
