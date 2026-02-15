import { IWorkspace } from "../interfaces";

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
}

const workspaceRegistry = new WorkspaceRegistry();

export { workspaceRegistry };
