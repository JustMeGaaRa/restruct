# `@structurizr/dsl`

A type-safe, developer-friendly TypeScript library for building **Structurizr** workspaces and **C4 Model** diagrams. This package allows you to define your architecture as code with full IDE support (Intellisense) and compute visual diagrams from your model.

---

## 🚀 How to Start

### Installation

```bash
pnpm add @structurizr/dsl
# or
npm install @structurizr/dsl
```

### Basic Setup

```typescript
import {
    IContainer,
    ISoftwareSystem,
    workspace,
    workspaceRegistry,
} from "@structurizr/dsl";

let springPetClinit: ISoftwareSystem;
let webApplication: IContainer;
let database: IContainer;

workspace("Amazon Web Services Example", "An example AWS deployment.", (_) => {
    _.model((_) => {
        springPetClinit = _.softwareSystem(
            "Spring PetClinic",
            "Allows employees to view and manage information regarding the veterinarians, the clients, and their pets.",
            (_) => {
                webApplication = _.container(
                    "Web Application",
                    "Allows employees to view and manage information regarding the veterinarians, the clients, and their pets."
                );
                database = _.container(
                    "Database",
                    "Stores information regarding the veterinarians, the clients, and their pets."
                );
            }
        );

        _.uses(
            webApplication.identifier,
            database.identifier,
            "Reads from and writes to"
        );
    });

    _.views((_) => {
        _.styles((_) => {
            _.element("Element", { shape: "roundedBox" });
            _.element("Person", { shape: "person" });
            _.element("Database", { shape: "cylinder" });
        });
    });
});

const petClinic = workspaceRegistry.getWorkspace("Amazon Web Services Example");
```

---

## 🛠️ What to Expect

The `@structurizr/dsl` package provides:

-   **Type Safety**: Every element (Person, Software System, Container, Component) is backed by TypeScript types.
-   **Dual Coding Styles**: Support for both **Imperative** (step-by-step) and **Fluent** (chainable) API designs.
-   **Standard Compliance**: Strictly follows the Structurizr and C4 model hierarchy and relationships.
-   **Diagram Computation**: Automatically calculates layout metadata and relationships for rendering engines like `@structurizr/react`.

---

## 📋 Feature Checklist

-   [x] **Workspace Structure Support**
    -   [x] Imperative style
    -   [x] Fluent style
-   [x] **C4 Diagrams Support**
    -   **Diagram as Code Coding Styles**:
        -   [ ] Imperative style support
        -   [ ] Fluent style support
    -   **Diagram Types**:
        -   [x] System Landscape ([see this example](./docs/examples/bigbankplc/README.md))
        -   [x] System Context
        -   [x] Container
        -   [x] Component
        -   [ ] Deployment ([see this example](./docs/examples/pet-clinic/README.md))

---

---

## 🔧 Development

This package is part of the [Restruct](https://github.com/JustMeGaaRa/restruct) monorepo.

```bash
# Run tests
pnpm test

# Lint code
pnpm lint
```
