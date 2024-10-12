import {
    IComponentView,
    IContainerView,
    ISystemContextView,
    ISystemLandscapeView,
    IWorkspace,
} from "../interfaces";
import {
    ComponentDiagramBuilder,
    ComponentDiagramVisitor,
    ContainerDiagramBuilder,
    ContainerDiagramVisitor,
    SystemContextDiagramBuilder,
    SystemContextDiagramVisitor,
    SystemLandscapeDiagramBuilder,
    SystemLandscapeDiagramVisitor,
} from "./builders";
import {
    ComponentViewStrategy,
    ContainerViewStrategy,
    SystemContextViewStrategy,
    SystemLandscapeViewStrategy,
} from "./strategies";

export * from "./builders";
export * from "./strategies";

export const createSystemLandscapeDiagram = (
    workspace: IWorkspace,
    systemLandscapeView: ISystemLandscapeView
) => {
    const builder = new SystemLandscapeDiagramBuilder();
    const visitor = new SystemLandscapeDiagramVisitor(builder);
    const strategy = new SystemLandscapeViewStrategy(
        workspace.model,
        systemLandscapeView
    );
    strategy.accept(visitor);
    return builder.build();
};

export const createSystemContextDiagram = (
    workspace: IWorkspace,
    systemContextView: ISystemContextView
) => {
    const builder = new SystemContextDiagramBuilder();
    const visitor = new SystemContextDiagramVisitor(builder);
    const strategy = new SystemContextViewStrategy(
        workspace.model,
        systemContextView
    );
    strategy.accept(visitor);
    return builder.build();
};

export const createContainerDiagram = (
    workspace: IWorkspace,
    containerView: IContainerView
) => {
    const builder = new ContainerDiagramBuilder();
    const visitor = new ContainerDiagramVisitor(builder);
    const strategy = new ContainerViewStrategy(workspace.model, containerView);
    strategy.accept(visitor);
    return builder.build();
};

export const createComponentDiagram = (
    workspace: IWorkspace,
    componentView: IComponentView
) => {
    const builder = new ComponentDiagramBuilder();
    const visitor = new ComponentDiagramVisitor(builder);
    const strategy = new ComponentViewStrategy(workspace.model, componentView);
    strategy.accept(visitor);
    return builder.build();
};
