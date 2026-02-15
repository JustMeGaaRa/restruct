import { IWorkspace } from "../../interfaces";
import { BuilderCallback } from "../../shared";
import { Workspace } from "../Workspace";
import { WorkspaceBuilder } from "./WorkspaceBuilder";
import { workspaceRegistry } from "../../shared/WorkspaceResgistry";

export const workspace = (
    name: string,
    description?: string,
    callback?: BuilderCallback<WorkspaceBuilder>
): IWorkspace => {
    const workspaceBuilder = new WorkspaceBuilder(name, description);
    callback?.(workspaceBuilder);

    const workspace = new Workspace(workspaceBuilder.build()).toSnapshot();
    workspaceRegistry.register(workspace);

    return workspace;
};
