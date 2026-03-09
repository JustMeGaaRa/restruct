---
sidebar_position: 1
sidebar_label: Installation
---

# Structurizr DSL

Structurizr DSL is a domain-specific language implemented in TypeScript for describing software architecture. It provides a fluent and type-safe API to define your architecture models and views.

## Installation

Install the package via npm:

```bash
npm install @structurizr/dsl
```

Or via yarn:

```bash
yarn add @structurizr/dsl
```

## Quick Start

The DSL uses a callback-based fluent API to build a workspace.

```typescript
import { workspace } from "@structurizr/dsl";

export default workspace(
    "Architecture",
    "A short description of my architecture",
    (_) => {
        _.model((_) => {
            const user = _.person("User", "A user of my software system");
            const system = _.softwareSystem(
                "Software System",
                "My software system"
            );
            _.uses(user.identifier, system.identifier, "Uses");
        });

        _.views((_) => {
            _.systemLandscapeView("SystemLandscape", "A system landscape view");
        });
    }
);
```
