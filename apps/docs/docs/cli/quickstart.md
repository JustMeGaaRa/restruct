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
restruct serve
```

## Export your workspaces

```bash
restruct export --pretty
```

This will generate workspace JSON files in the `exports` directory, including Git metadata for each workspace (authors and last modified dates).
