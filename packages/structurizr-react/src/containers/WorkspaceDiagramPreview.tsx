import { ViewType, View } from "@restruct/structurizr-dsl";
import { Viewport, ViewportProvider } from "@restruct/react-svg";
import { PropsWithChildren, FC } from "react";
import {
    ComponentDiagram,
    ContainerDiagram,
    SystemContextDiagram,
    SystemLandscapeDiagram,
    ModelDiagram,
    DeploymentDiagram,
} from "../components/diagrams";

export interface WorkspaceContentProps {
    currentView?: View;
}

export const WorkspaceDiagramPreview: FC<
    PropsWithChildren<WorkspaceContentProps>
> = ({ children, currentView }) => {
    return (
        <ViewportProvider>
            <Viewport>
                {currentView &&
                    currentView?.type === ViewType.SystemLandscape && (
                        <SystemLandscapeDiagram value={currentView} />
                    )}
                {currentView &&
                    currentView?.type === ViewType.SystemContext && (
                        <SystemContextDiagram
                            key={currentView.key}
                            value={currentView}
                        />
                    )}
                {currentView && currentView?.type === ViewType.Container && (
                    <ContainerDiagram
                        key={currentView.key}
                        value={currentView}
                    />
                )}
                {currentView && currentView?.type === ViewType.Component && (
                    <ComponentDiagram
                        key={currentView.key}
                        value={currentView}
                    />
                )}
                {currentView && currentView?.type === ViewType.Deployment && (
                    <DeploymentDiagram
                        key={currentView.key}
                        value={currentView}
                    />
                )}
                {currentView?.type === ViewType.Model && (
                    <ModelDiagram value={currentView} />
                )}
            </Viewport>
            {children}
        </ViewportProvider>
    );
};
