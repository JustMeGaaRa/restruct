# Restruct Preview App

The **Restruct Preview App** is a React-based application designed to visualize Structurizr DSL workspaces. It serves as the primary rendering engine for the Restruct VS Code extension but can also be run as a standalone web application.

## 🌟 Features

### 1. C4 Diagram Rendering

visualize your architecture using the C4 model standards:

-   **System Landscape**
-   **System Context**
-   **Container Views**
-   **Component Views**
-   **Deployment Views**

### 2. Interactive Navigation

-   **Zoom & Pan**: Use the toolbar or mouse gestures (wheel/drag) to explore large diagrams on an infinite canvas.
-   **Breadcrumbs**: Context-aware navigation bar showing your current position in the architectural hierarchy (e.g., `System > Container > Component`).
-   **View Switcher**: Quickly toggle between different perspectives:
    -   **Diagram**: The standard graphical representation.
    -   **Model**: A structural view of the model elements.
    -   **Deployment**: Infrastructure and deployment mapping.

### 3. Presentation & Recording

Transform your static diagrams into dynamic architectural stories:

-   **Recording Mode**: Capture specific states (zoom level, visible elements) to create a step-by-step walkthrough.
-   **Presentation Mode**: Play back your recorded steps with smooth fade and scale animations.
-   **Export**: (Planned) Export walkthroughs as GIFs or videos.

## 🛠️ Development

### Prerequisites

-   Node.js & pnpm

### Start Local Server

To run the app locally with Hot Module Replacement (HMR):

```bash
npm run dev
# or
pnpm dev
```

### Build

To build the application for production (e.g., for embedding in the extension):

```bash
npm run build
# or
pnpm build
```

## 📦 Dependencies

-   **@structurizr/dsl**: For workspace parsing and manipulation.
-   **@structurizr/react**: Core diagram rendering components.
-   **@restruct/ui**: Shared UI components (Breadcrumbs, Toolbar, etc.).
-   **Vite**: Fast tooling.
