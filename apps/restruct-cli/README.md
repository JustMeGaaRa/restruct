# Restruct CLI

A command-line tool for diagram-as-code using [Structurizr DSL](https://structurizr.com/dsl).

This CLI allows you to:

-   Initialize new diagram projects (`restruct init`)
-   Serve projects locally with live updates (`restruct serve`)
-   Build static documentation sites (`restruct build`)

## Features

### `restruct init`

-   Scaffolds a new project with `package.json`, `tsconfig.json`, and `workspace.ts`.
-   Uses `@structurizr/dsl` for defining architecture as code.
-   Includes `build` and `serve` scripts.

### `restruct build`

-   Compiles the user's `workspace.ts` into a static asset.
-   Bundles the internal `preview-app` (React + Vite).
-   Injects the compiled workspace into `index.html` for zero-config deployment.
-   Supports `WorkspaceRegistry` for seamless integration.

### `restruct serve`

-   Starts a local development server on `http://localhost:3000`.
-   Watches workspace.ts for changes.
-   Pushes live updates to the browser via WebSockets.
-   Hot-reloads the diagram view without refreshing the page.
-   Robust Connection: Namespaced WebSocket connection avoids conflicts with development tools.

## Installation

### From Source (Development)

1. Clone the repository.
2. Navigate to the CLI package:
    ```bash
    cd packages/restruct-cli
    ```
3. Install dependencies:
    ```bash
    pnpm install
    ```
4. Build the package:
    ```bash
    pnpm build
    ```
5. Link the package globally (optional, for testing):
    ```bash
    npm link
    # OR
    pnpm link --global
    ```
    Now you can use the `restruct` command anywhere.

## Usage

### 1. Initialize a Project

Create a new directory with a sample workspace configuration.

```bash
restruct init my-design
```

This generates:

-   `workspace.ts`: A sample Structurizr DSL definition.
-   `package.json`: Project dependencies.
-   `tsconfig.json`: TypeScript configuration.
-   `vite.config.ts`: Configuration for the preview app (managed internally).

### 2. Live Preview (Serve)

Navigate to your project directory and start the development server.

```bash
cd my-design
pnpm install
restruct serve
```

-   Opens a local web server (http://localhost:3000).
-   Watches `workspace.ts` for changes.
-   Automatically updates the browser when you save your files.

### 3. Build Static Site

Generate a static HTML/JS bundle of your diagrams.

```bash
restruct build
```

The output will be in the `dist/` directory. You can serve this folder with any static file server (e.g., `npx http-server dist`).

## Development

If you haven't linked the CLI globally, you can run it directly from the built output:

```bash
# From the root of the monorepo
node packages/restruct-cli/dist/index.js init test-project
node packages/restruct-cli/dist/index.js serve
```
