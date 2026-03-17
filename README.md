# re:struct Architecture SDK

[![pnpm](https://img.shields.io/badge/maintained%20with-pnpm-cc00ff.svg)](https://pnpm.io/)
[![Turborepo](https://img.shields.io/badge/built%20with-turborepo-0070f3.svg)](https://turbo.build/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**re:struct** is a TypeScript-first tooling suite for writing and visualizing software architecture using the **C4 Model** and a **Structurizr-compatible DSL**. It lets you define architecture as code and preview it interactively — in VS Code or directly from the command line.

---

## ✨ Features

-   **Type-safe workspace modeling** — define Workspaces, Models, and Views with full TypeScript intellisense
-   **C4 diagram support** — System Landscape, System Context, Container, Component, and Deployment views
-   **Interactive diagrams** — pan, zoom, and navigate across C4 layers
-   **VS Code Extension** — `Restruct: Preview Workspace` command with live reload via WebSocket
-   **CLI tool** — manage architecture workspace project lifecycle with commands and dev preview
-   **Documentation** — guides for DSL, React components, and CLI
-   **Storybook** — isolated development for shared UI components

---

## 📦 Packages

| Package                       | Description                                                               |
| ----------------------------- | ------------------------------------------------------------------------- |
| `@restruct/structurizr-dsl`   | Core C4 model library — elements, views, builders, auto-layout strategies |
| `@restruct/structurizr-react` | React components for rendering C4 diagrams                                |
| `@restruct/ui`                | Shared UI components to use for workspace preview                         |
| `@restruct/react-svg`         | Low-level SVG/graph rendering primitives                                  |
| `@restruct/eslint-config`     | Shared ESLint configuration                                               |
| `@restruct/typescript-config` | Shared TypeScript configuration                                           |

---

## 🖥️ Apps

| App                     | Description                                                                                                      |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `apps/vscode-extension` | VS Code extension — contributes the `Restruct: Preview Workspace` command and a WebSocket server for live reload |
| `apps/vscode-preview`   | Vite + React webview rendered inside the VS Code preview panel                                                   |
| `apps/cli`              | CLI tool — `restruct init / serve / build` for scaffolding and local previews                                    |
| `apps/docs`             | Docusaurus documentation site with DSL quick-start guides and examples                                           |

---

## 🚀 Getting Started

### Prerequisites

-   **Node.js** v18 or higher
-   **pnpm** v8 or higher

### 1. Clone & Install

```bash
git clone https://github.com/JustMeGaaRa/restruct.git
cd restruct
pnpm install
```

### 2. Launch Development Environment

Start all apps and watch for package changes:

```bash
pnpm dev
```

### 3. Run Storybook

Explore UI components in isolation:

```bash
pnpm storybook
```

---

## 📂 Repository Structure

```text
restruct/
├── apps/
│   ├── vscode-extension/   # VS Code extension (preview command + WebSocket server)
│   ├── vscode-preview/     # Vite/React webview for VS Code preview panel
│   ├── restruct-cli/       # CLI: init / serve / build commands
│   └── docs/               # Documentation portal (Docusaurus)
├── packages/
│   ├── structurizr-dsl/    # @restruct/structurizr-dsl – TS C4 model library
│   ├── structurizr-react/  # @restruct/structurizr-react – React C4 diagram components
│   ├── ui/                 # @restruct/ui – Shared UI components
│   ├── graph-svg/          # @restruct/react-svg – SVG/graph primitives
│   ├── eslint-config/      # Shared ESLint config
│   └── typescript-config/  # Shared TypeScript config
└── pnpm-workspace.yaml
```

---

## 🤝 Contributing

We welcome contributions! Please feel free to open issues or submit pull requests.

1. Fork the repo.
2. Create your feature branch (`git checkout -b feature/amazing-feature`).
3. Commit your changes (`git commit -m 'Add amazing feature'`).
4. Push to the branch (`git push origin feature/amazing-feature`).
5. Open a Pull Request.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
