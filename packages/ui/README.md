# `@restruct/ui`

A shared React component library for the Restruct ecosystem. This package contains reusable UI components used across the `vscode-preview` app and other applications.

## 📚 Components

### `Breadcrumbs`

A navigation component that displays the hierarchical path of the current view.

-   **Usage**: Displays the path like `Software System > Container > Component`.
-   **Features**: Clickable segments for easy navigation up the hierarchy.

### `ZoomControls`

A toolbar for controlling the viewport of the diagram canvas.

-   **Features**:
    -   Zoom In / Zoom Out buttons.
    -   Fit to Screen functionality.
    -   Reset Zoom.

### `ViewModeSwitcher`

A segmented control to switch between different visualization modes.

-   **Modes**:
    -   **Diagrams**: Standard C4 diagram view.
    -   **Model**: Tree/List view of the model structure.
    -   **Deployment**: Infrastructure view.

## 💻 Development

This package is part of the Restruct monorepo.

### Build

```bash
pnpm build
```

### Lint

```bash
pnpm lint
```
