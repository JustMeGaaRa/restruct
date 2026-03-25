import {
    createSystemLandscapeDiagram,
    createContainerDiagram,
    createDeploymentDiagram,
    createComponentDiagram,
    Diagram,
    IWorkspace,
    View,
    ViewType,
    createSystemContextDiagram,
} from "@restruct/structurizr-dsl";
import {
    WorkspaceProvider,
    WorkspaceDiagramProvider,
    WorkspaceDiagramPreview,
} from "@restruct/structurizr-react";
import { renderToStaticMarkup } from "react-dom/server";
import { autolayoutDiagram } from "../../utils";

type DiagramRenderProps = {
    type: ViewType;
    view: View;
    diagram: Diagram;
};

export class WorkspaceSvgExporter {
    async export(workspace: IWorkspace): Promise<Record<string, string>> {
        const result: Record<string, string> = {};

        if (workspace) {
            const views: Array<DiagramRenderProps> = [];

            if (workspace.views.systemLandscape) {
                views.push({
                    type: ViewType.SystemLandscape,
                    view: workspace.views.systemLandscape,
                    diagram: createSystemLandscapeDiagram(
                        workspace,
                        workspace.views.systemLandscape
                    ),
                });
            }

            views.push(
                ...workspace.views.systemContexts.map((view) => ({
                    type: ViewType.SystemContext,
                    view: view,
                    diagram: createSystemContextDiagram(workspace, view),
                }))
            );

            views.push(
                ...workspace.views.containers.map((view) => ({
                    type: ViewType.Container,
                    view: view,
                    diagram: createContainerDiagram(workspace, view),
                }))
            );

            views.push(
                ...workspace.views.components.map((view) => ({
                    type: ViewType.Component,
                    view: view,
                    diagram: createComponentDiagram(workspace, view),
                }))
            );

            views.push(
                ...workspace.views.deployments.map((view) => ({
                    type: ViewType.Deployment,
                    view: view,
                    diagram: createDeploymentDiagram(workspace, view),
                }))
            );

            for (const { type, view, diagram } of views) {
                const autolayout = await autolayoutDiagram(diagram, type);

                const diagrams = new Map([[view.key, diagram]]);
                const metadata = new Map([[view.key, autolayout]]);

                const markup = renderToStaticMarkup(
                    <WorkspaceProvider
                        workspace={workspace}
                        setWorkspace={() => {}}
                    >
                        <WorkspaceDiagramProvider
                            diagrams={diagrams}
                            metadata={metadata}
                        >
                            <WorkspaceDiagramPreview
                                currentView={view}
                            ></WorkspaceDiagramPreview>
                        </WorkspaceDiagramProvider>
                    </WorkspaceProvider>
                );

                result[view.key] = markup;
            }
        }

        return result;
    }
}
