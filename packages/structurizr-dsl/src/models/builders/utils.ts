import { IWorkspace } from "../../interfaces";
import { BuilderCallback } from "../../shared";
import { Workspace } from "../Workspace";
import { WorkspaceBuilder } from "./WorkspaceBuilder";

export const workspace = (
    name: string,
    description?: string,
    callback?: BuilderCallback<WorkspaceBuilder>
): IWorkspace => {
    const workspaceBuilder = new WorkspaceBuilder(name, description);
    callback?.(workspaceBuilder);
    return new Workspace(workspaceBuilder.build()).toSnapshot();
};
