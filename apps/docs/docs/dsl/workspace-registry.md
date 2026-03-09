---
sidebar_position: 5
sidebar_label: Workspace Registry
---

# Workspace Registry

The `workspaceRegistry` is a singleton object that serves as a central repository for all architecture workspaces defined using the `workspace` fluent utility function.

When you use the `workspace` utility, it automatically registers the resulting workspace into this registry, making it easy to retrieve and manage multiple workspaces in a single environment.

## Usage

You can import `workspaceRegistry` directly from `@structurizr/dsl`.

```typescript
import { workspaceRegistry } from "@structurizr/dsl";
```

### Fetching a Specific Workspace

If you have multiple workspaces defined or loaded, you can fetch them by name.

```typescript
const myWorkspace = workspaceRegistry.getWorkspace("My Architecture");

if (myWorkspace) {
    console.log(`Found workspace: ${myWorkspace.name}`);
}
```

### Listing All Workspaces

The registry can also provide a list of all workspaces that have been defined or loaded. This is particularly useful for tools or previewers that need to render all available architecture diagrams.

```typescript
const allWorkspaces = workspaceRegistry.getWorkspaces();

allWorkspaces.forEach((workspace) => {
    console.log(`Workspace Name: ${workspace.name}`);
});
```

## How It Works

The registration happens automatically behind the scenes when you use the `workspace` helper:

```typescript
import { workspace } from "@structurizr/dsl";

// This call automatically registers "System A" into the workspaceRegistry
workspace("System A", "Description", (_) => {
    // ...
});

// This call registers "System B"
workspace("System B", "Description", (_) => {
    // ...
});
```

### Use Cases

-   **CLI Tools**: A CLI tool can import multiple TypeScript files, each defining its own workspace, and use the registry to export all of them to JSON.
-   **VS Code Previews**: The extension can scan a file, run it, and then query the registry to find which workspace to render.
-   **Documentation Generators**: If your project spans multiple software systems, the registry ensures you have a single source of truth for all of them.
