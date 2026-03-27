---
sidebar_position: 1
---

# Init

The `init` command initializes a new `re:struct` project. It sets up the basic folder structure, configurations, and a sample workspace.

## Usage

```bash
restruct init [name]
```

A typical project created with `init` includes:

-   `package.json`: Contains scripts for `build` and `serve`.
-   `workspaces/index.ts`: The entry point for your architecture definitions.
-   `tsconfig.json`: TypeScript configuration.
-   `.gitignore`: Default git ignore rules.

## Description

The `init` command initializes a new `re:struct` project. It sets up the basic folder structure, configurations, and a sample workspace.

-   If `[name]` is provided, a new directory with that name will be created.
-   If `[name]` is omitted, the CLI will prompt you for a project name.

## Options

| Option      | Description              |
| ----------- | ------------------------ |
| `--help`    | Show help information    |
| `--version` | Show version information |

## Example

```bash
restruct init my-architecture
```
