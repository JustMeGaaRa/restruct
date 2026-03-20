import { IWorkspace } from "../interfaces";
import { IWorkspaceMetadata } from "../metadata";

class WorkspaceRegistry {
    private workspaces: IWorkspace[] = [];

    public constructor() {}

    public register(workspace: IWorkspace) {
        this.workspaces.push(workspace);
    }

    public getWorkspaces(): IWorkspace[] {
        return this.workspaces;
    }

    public getWorkspace(name: string): IWorkspace | undefined {
        return this.workspaces.find((workspace) => workspace.name === name);
    }

    public getMeta(): IWorkspaceMetadata[] {
        return this.workspaces.map(
            (workspace) =>
                ({
                    name: workspace.name ?? "Untitled workspace",
                    lastModifiedDate: workspace.lastModifiedDate
                        ? new Date(workspace.lastModifiedDate)
                        : new Date(),
                    authors: [],
                    views: workspace.views,
                }) satisfies IWorkspaceMetadata
        );
    }
}

const workspaceRegistry = new WorkspaceRegistry();

export { workspaceRegistry };
