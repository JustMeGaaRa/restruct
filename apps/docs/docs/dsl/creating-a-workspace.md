---
sidebar_position: 2
sidebar_label: Creating a Workspace
---

# Creating a Workspace

The foundation of any Structurizr DSL architecture is the `workspace`.

The `workspace` is a container for your architecture model, views, and documentation. It's usually defined as a top-level block.

```typescript
import { workspace } from "@restruct/structurizr-dsl";

workspace(
    "Architecture Workspace",
    "A description for your architecture",
    (_) => {
        // Other elements like model and views go here
    }
);
```

The first argument is the name of the workspace, the second is a description, and the last is a callback function where you'll define the content of the workspace.

## Workspace Customization

You can also customize the workspace with a more detailed description or specific settings.

```typescript
workspace("My Enterprise Architecture", "", (_) => {
    _.description("Detailed description of the enterprise architecture.");
});
```
