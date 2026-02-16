# Restruct Architecture Suite

[![pnpm](https://img.shields.io/badge/maintained%20with-pnpm-cc00ff.svg)](https://pnpm.io/)
[![Turborepo](https://img.shields.io/badge/built%20with-turborepo-0070f3.svg)](https://turbo.build/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Restruct** is a modern, developer-centric suite of tools designed to visualize, document, and present software architecture. Built on the foundations of the **Structurizr DSL** and the **C4 Model**, Restruct allows you to treat architecture as code while providing world-class visual experiences.

---

## 🌟 What to Expect

Restruct aims to bridge the gap between static architecture documents and dynamic, living software systems. With Restruct, you can:

-   **Design with DSL**: Use a clean, TypeScript-based DSL to define your software systems, containers, and components.
-   **Visualize Instantly**: High-fidelity, interactive C4 diagrams that support deep navigation through architectural layers.
-   **Collaborate in Real-time**: Built-in support for P2P collaborative sessions for team architecture reviews.
-   **Present Your Vision**: A unique "Presentation Mode" that allows you to record "stories" through your architecture and play them back for stakeholders.
-   **Developer-First**: Integrated deeply into the developer workflow, including a VS Code extension for live previews.

---

## 🚀 Main Products

### 🛠️ Restruct DSL (`@structurizr/dsl`)

The backbone of the suite. A type-safe TypeScript library for building Structurizr-compatible workspace models. It supports both imperative and fluent coding styles.

### 🎨 Restruct React Components (`@structurizr/react`)

A comprehensive library of React components for rendering C4 diagrams. These components are interactive, accessible, and highly customizable.

### 🔍 VS Code Extension & Preview (`apps/vscode-preview`)

The primary interface for developers. It provides a real-time, interactive preview of your architecture DSL files directly within VS Code, featuring:

-   **C4 Rendering**: Automatic layout and rendering of your models.
-   **Interactive Viewport**: Infinite pan, zoom, and fit-to-screen.
-   **Breadcrumb Navigation**: Path-based navigation (e.g., `System > Container > Component`).
-   **Presentation Tools**: Record and present architecture walkthroughs.

---

## 🛠️ How to Start

### Prerequisites

-   **Node.js**: v18 or higher.
-   **pnpm**: v8 or higher (Restruct uses pnpm workspaces).

### 1. Clone & Install

```bash
git clone https://github.com/JustMeGaaRa/restruct.git
cd restruct
pnpm install
```

### 2. Launch Development Environment

To start the development server for all apps (Preview, Web, Docs) and watch for package changes:

```bash
pnpm dev
```

### 3. Run Storybook

To explore the UI components in isolation:

```bash
pnpm storybook
```

---

## 📂 Repository Structure

```text
restruct/
├── apps/
│   ├── vscode-preview/ # Core rendering engine & VS Code webview
│   ├── web/            # Main web application (Next.js)
│   └── docs/           # Documentation portal (Next.js)
├── packages/
│   ├── structurizr-dsl/# TS library for C4 modeling
│   ├── structurizr-react/# React components for diagrams
│   ├── ui/             # Shared UI Design System
│   ├── graph-svg/      # Low-level SVG generation utilities
│   ├── eslint-config/  # Shared linting rules
│   └── typescript-config/# Shared TS configurations
└── pnpm-workspace.yaml # Monorepo configuration
```

---

## 🤝 Contributing

We welcome contributions! Please feel free to open issues or submit pull requests.

1.  Fork the repo.
2.  Create your feature branch (`git checkout -b feature/amazing-feature`).
3.  Commit your changes (`git commit -m 'Add amazing feature'`).
4.  Push to the branch (`git push origin feature/amazing-feature`).
5.  Open a Pull Request.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
