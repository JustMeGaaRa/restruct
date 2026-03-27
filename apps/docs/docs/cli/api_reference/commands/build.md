---
sidebar_position: 2
---

# Build

The build command is used to build the project.

## Usage

```bash
restruct build
```

## Description

The `build` command generates a static architecture documentation site.

-   It cleans the `dist/` directory.
-   Bundles your workspaces into a single script.
-   Generates an `index.html` file that loads your architecture.

## Options

| Option      | Description              |
| ----------- | ------------------------ |
| `--help`    | Show help information    |
| `--version` | Show version information |

## Output

The result of this command is stored in the `dist/` folder:

-   `index.html`: The entry point for the static site.
-   `assets/`: Contains the bundled JavaScript and other assets.
-   `static/`: Any static assets used (images, etc.).

## Example

```bash
restruct build
```
