---
sidebar_position: 1
---

# Quickstart

re:struct CLI is a command-line interface for re:struct.

## Installation

```bash
npm install -g @restruct/cli
```

## Create a new project

```bash
restruct init
```

## Developer preview

```bash
# Start the development server with live updates
restruct dev
```

## Export your workspaces

```bash
# Export as pretty-printed JSON
restruct export --pretty

# Or export views as SVG images
restruct export -f svg
```

This will generate files in the `exports` directory:
- **JSON**: Complete workspace model with Git metadata (authors, timestamps)
- **SVG**: Individual image files for every architecture view
- **DSL**: Original Structurizr DSL compatible output
