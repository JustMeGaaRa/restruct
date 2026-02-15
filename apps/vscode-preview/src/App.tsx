import { IWorkspace } from "@structurizr/dsl";
import { Viewport, ViewportProvider } from "@graph/svg";
import {
    ComponentDiagram,
    ContainerDiagram,
    SystemContextDiagram,
    SystemLandscapeDiagram,
    Workspace,
    WorkspaceProvider,
} from "@structurizr/react";
import { ViewModeSwitcher, ViewMode } from "@restruct/ui";
import { bigBankPlc } from "./workspace";
import { useState } from "react";
import { Center, Text } from "@chakra-ui/react";

export const App = () => {
    const [workspace, setWorkspace] = useState<IWorkspace>(bigBankPlc);
    const [selectedView] = useState(workspace?.views.systemLandscape);
    const [viewMode, setViewMode] = useState<ViewMode>("diagrams");

    return (
        <div
            className={
                "flex items-center justify-center h-screen w-screen bg-neutral-950"
            }
        >
            <ViewModeSwitcher currentView={viewMode} onChange={setViewMode} />

            {viewMode === "diagrams" && (
                <WorkspaceProvider
                    workspace={workspace}
                    setWorkspace={setWorkspace}
                >
                    <Workspace>
                        <ViewportProvider>
                            <Viewport>
                                {selectedView?.key ===
                                    workspace.views.systemLandscape?.key && (
                                    <SystemLandscapeDiagram
                                        value={workspace.views.systemLandscape}
                                    />
                                )}
                                {workspace.views.systemContexts
                                    .filter((x) => x.key === selectedView?.key)
                                    .map((systemContext) => (
                                        <SystemContextDiagram
                                            key={systemContext.key}
                                            value={systemContext}
                                        />
                                    ))}
                                {workspace.views.containers
                                    .filter((x) => x.key === selectedView?.key)
                                    .map((container) => (
                                        <ContainerDiagram
                                            key={container.key}
                                            value={container}
                                        />
                                    ))}
                                {workspace.views.components
                                    .filter((x) => x.key === selectedView?.key)
                                    .map((component) => (
                                        <ComponentDiagram
                                            key={component.key}
                                            value={component}
                                        />
                                    ))}
                            </Viewport>
                        </ViewportProvider>
                    </Workspace>
                </WorkspaceProvider>
            )}

            {viewMode === "model" && (
                <Center h="100%" color="white">
                    <Text>Model View (Implementation Pending)</Text>
                </Center>
            )}

            {viewMode === "deployment" && (
                <Center h="100%" color="white">
                    <Text>Deployment View (Implementation Pending)</Text>
                </Center>
            )}
        </div>
    );
};
