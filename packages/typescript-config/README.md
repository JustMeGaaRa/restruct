# `@restruct/typescript-config`

Shared TypeScript configurations used throughout the Restruct monorepo.

## 📦 Configs

-   `base.json`: Base configuration for TypeScript projects.
-   `nextjs.json`: Configuration optimized for Next.js apps.
-   `react-library.json`: Configuration for React libraries.

## 🛠️ Usage

In your `tsconfig.json`:

```json
{
    "extends": "@restruct/typescript-config/base.json",
    "compilerOptions": {
        "outDir": "dist",
        "rootDir": "src"
    },
    "include": ["src"]
}
```
