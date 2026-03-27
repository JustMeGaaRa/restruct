---
sidebar_position: 3
---

# Dev

The `dev` command starts a development server with live updates for your architecture project.

## Usage

```bash
restruct dev
```

## Description

The `dev` command is the main tool for local development.

-   **Live Reload**: Automatically rebuilds and reloads the preview when you change your `.ts` files.
-   **Preview**: Starts a local web server (usually on port 3000).
-   **WebSocket**: Maintains a connection between the CLI and the preview app for seamless updates.

## Options

| Option      | Description              |
| ----------- | ------------------------ |
| `--help`    | Show help information    |
| `--version` | Show version information |

## Tips

Projects created with `restruct init` include an `npm run serve` script which internally calls `restruct dev`.

```bash
npm run serve
```
