# Export

The `export` command allows you to export your workspace definitions into various formats (currently focusing on JSON) for use in other tools or for visualization.

## Usage

```bash
restruct export [options]
```

## Options

| Option                  | Description                                                           | Default                         |
| :---------------------- | :-------------------------------------------------------------------- | :------------------------------ |
| `-f, --format <format>` | The output format to use. Currently supports: `json`, `svg`, `dsl`.   | `json`                          |
| `-p, --pretty`          | Pretty-print the output (primarily for JSON).                         | `false`                         |
| `-o, --output <dir>`    | The directory where the `exports` folder will be created.             | `.` (current working directory) |
| `--meta`                | Include metadata like authors and last modified date (only for JSON). | `true`                          |

## Formats

Each exported workspace is saved to the `exports` directory, which is created automatically if it doesn't already exist.

| Format | Output                                   | Description                                                                                   |
| :----- | :--------------------------------------- | :-------------------------------------------------------------------------------------------- |
| `json` | `${workspaceName}/${workspaceName}.json` | A standard JSON representation of the entire workspace.                                       |
| `svg`  | `${workspaceName}/${viewKey}.svg`        | Renders all views within the workspace into SVG files. Each view is saved as a separate file. |
| `dsl`  | `${workspaceName}/${workspaceName}.dsl`  | Re-exports the workspace definition in Structurizr DSL format.                                |

## Examples

### JSON Export (minified)

Export all workspaces to the `exports` folder as minified JSON.

```bash
restruct export
```

### SVG Export

Generate SVG images for all views defined in your workspaces.

```bash
restruct export --format svg
```

### DSL Export

Export your workspace definitions into the Structurizr DSL format.

```bash
restruct export -f dsl
```

### Pretty-printed JSON with Metadata

Export workspaces with human-readable JSON and include git-derived metadata.

```bash
restruct export --pretty --meta
```

## Metadata Requirements

When using the `--meta` flag (which is enabled by default), `restruct` attempts to enrich the workspace exports with information from your version control system.

### Constraints & Prerequisites

1.  **Git Client**: A native `git` client must be installed on your host machine and available in your system's `PATH`.
2.  **Git Repository**: The command must be run within a directory that is part of a Git repository (or a Git worktree).
3.  **Default Branch history**: To reliably extract the full list of contributors and timestamps, the tool relies on accessing the history of the current branch (falling back to `main` or `master` if necessary).

If these requirements are not met, the Command will still succeed, but the `authors` list will be empty and the `lastModifiedDate` will default to the current system time.

### How it works

`restruct` scans the source files associated with each workspace and uses `git log --follow` to trace the entire history of those files, including renames and moves, to gather a complete list of unique contributors.
