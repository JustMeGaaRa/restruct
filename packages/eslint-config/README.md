# `@restruct/eslint-config`

Shared ESLint configurations for the Restruct monorepo. This package ensures consistent code style and quality across all apps and packages.

## 📦 Configs

-   `@restruct/eslint-config/base`: Basic linting for TypeScript.
-   `@restruct/eslint-config/next`: Linting optimized for Next.js applications (`web`, `docs`).
-   `@restruct/eslint-config/react-internal`: Linting for internal React component libraries (`ui`, `structurizr-react`).

## 🛠️ Usage

In your `package.json`:

```json
{
    "eslintConfig": {
        "extends": ["@restruct/eslint-config/base"]
    }
}
```
