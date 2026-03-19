export function createEntryScript(importPath: string): string {
    return `
import "${importPath}";
import { workspaceRegistry } from "@restruct/structurizr-dsl";

const workspaces = workspaceRegistry.getWorkspaces();
window.__WORKSPACES__ = workspaces.map(ws => ws.toSnapshot ? ws.toSnapshot() : ws);
`;
}
