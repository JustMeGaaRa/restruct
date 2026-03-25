import {
    IComponentView,
    IContainerView,
    IDeploymentView,
    ISystemContextView,
    ISystemLandscapeView,
    IWorkspace,
} from "../interfaces";
import { createDefaultModelView } from "../utils";
import {
    ComponentDiagramBuilder,
    ContainerDiagramBuilder,
    DeploymentDiagramBuilder,
    ModelDiagramBuilder,
    SystemContextDiagramBuilder,
    SystemLandscapeDiagramBuilder,
} from "./builders";
import {
    ComponentDiagramVisitor,
    ContainerDiagramVisitor,
    DeploymentDiagramVisitor,
    ModelElementVisitor,
    SystemContextDiagramVisitor,
    SystemLandscapeDiagramVisitor,
} from "./visitors";
import {
    ComponentViewStrategy,
    ContainerViewStrategy,
    DeploymentViewStrategy,
    ModelViewStrategy,
    SystemContextViewStrategy,
    SystemLandscapeViewStrategy,
} from "./strategies";

export const createModelDiagram = (workspace: IWorkspace) => {
    const view = createDefaultModelView();
    const builder = new ModelDiagramBuilder(view);
    const visitor = new ModelElementVisitor(builder);
    const strategy = new ModelViewStrategy(workspace);
    strategy.accept(visitor);
    return builder.build();
};

export const createSystemLandscapeDiagram = (
    workspace: IWorkspace,
    systemLandscapeView: ISystemLandscapeView
) => {
    const builder = new SystemLandscapeDiagramBuilder(systemLandscapeView);
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
    const builder = new SystemContextDiagramBuilder(systemContextView);
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
    const builder = new ContainerDiagramBuilder(containerView);
    const visitor = new ContainerDiagramVisitor(builder);
    const strategy = new ContainerViewStrategy(workspace.model, containerView);
    strategy.accept(visitor);
    return builder.build();
};

export const createComponentDiagram = (
    workspace: IWorkspace,
    componentView: IComponentView
) => {
    const builder = new ComponentDiagramBuilder(componentView);
    const visitor = new ComponentDiagramVisitor(builder);
    const strategy = new ComponentViewStrategy(workspace.model, componentView);
    strategy.accept(visitor);
    return builder.build();
};

export const createDeploymentDiagram = (
    workspace: IWorkspace,
    deploymentView: IDeploymentView
) => {
    const builder = new DeploymentDiagramBuilder(deploymentView);
    const visitor = new DeploymentDiagramVisitor(builder);
    const strategy = new DeploymentViewStrategy(
        workspace.model,
        deploymentView
    );
    strategy.accept(visitor);
    return builder.build();
};
