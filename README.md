# Restruct Architecture Suite

This is an official monorepo for Restruct architecture tools.

## Project Structure

This is a monorepo project setup using Turbo.

### Project Setup Checklist

-   [x] monorepo setup (turborepo)
-   [x] code formatter setup (prettier)
-   [x] initial vscode extension app setup (vite)
-   [x] testing library setup (vitest)
-   [x] ui library integration (nextui or shadcn/ui)

### Apps and Packages

-   `docs`: a [Next.js](https://nextjs.org/) app
-   `web`: another [Next.js](https://nextjs.org/) app
-   `@structurizr/dsl`: a library for building Structurizr workspaces and C4 diagrams with typescript.
-   `@structurizr/react`: a React component library for buiding Structurizr workspaces and rendering C4 diagrams.
-   `@restruct/ui`: a stub React component library shared by both `web` and `docs` applications
-   `@restruct/eslint-config`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
-   `@restruct/typescript-config`: `tsconfig.json`s used throughout the monorepo

### Utilities

This Turborepo has some additional tools already setup for you:

-   [TypeScript](https://www.typescriptlang.org/) for static type checking
-   [ESLint](https://eslint.org/) for code linting
-   [Prettier](https://prettier.io) for code formatting

### Build

To build all apps and packages, run the following command:

```
cd my-turborepo
pnpm build
```

### Develop

To develop all apps and packages, run the following command:

```
cd my-turborepo
pnpm dev
```
