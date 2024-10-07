import { IWorkspace } from "@structurizr/dsl";
import {
    ComponentDiagram,
    ContainerDiagram,
    SystemContextDiagram,
    SystemLandscapeDiagram,
    Views,
    Workspace,
    WorkspaceProvider
} from "@structurizr/react";
import { useState } from "react";
import { BigBankPlc } from "./workspace";

export const App = () => {
    const [workspace, setWorkspace] = useState<IWorkspace>(BigBankPlc);
    const [selectedView] = useState(workspace.views.systemLandscape);

    return (
        <div className={"flex items-center justify-center h-screen w-screen bg-slate-950"}>
            <WorkspaceProvider workspace={workspace} setWorkspace={setWorkspace}>
                <Workspace>
                    <Views>
                        {selectedView?.key === workspace.views.systemLandscape?.key && (
                            <SystemLandscapeDiagram value={workspace.views.systemLandscape} />
                        )}
                        {workspace.views.systemContexts.filter(x => x.key === selectedView?.key).map((systemContext) => (
                            <SystemContextDiagram key={systemContext.key} value={systemContext} />
                        ))}
                        {workspace.views.containers.filter(x => x.key === selectedView?.key).map((container) => (
                            <ContainerDiagram key={container.key} value={container} />
                        ))}
                        {workspace.views.components.filter(x => x.key === selectedView?.key).map((component) => (
                            <ComponentDiagram key={component.key} value={component} />
                        ))}
                    </Views>
                </Workspace>
            </WorkspaceProvider>
        </div>
    );
}
