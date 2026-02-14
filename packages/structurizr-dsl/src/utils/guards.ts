import {
    IComponentView,
    IContainerView,
    IDeploymentNode,
    IDeploymentView,
    IGroup,
    IInfrastructureNode,
    IPerson,
    ISoftwareSystem,
    ISystemContextView,
    ISystemLandscapeView,
    IWorkspace,
    IStyles,
    ISoftwareSystemInstance,
    IContainerInstance,
    IDeploymentEnvironment,
    IContainer,
    IComponent,
    IRelationship,
    ElementType,
    RelationshipType,
    ViewType,
    IModel,
    IViews,
    IElement,
} from "../interfaces";

export function isWorkspace(workspace: any): workspace is IWorkspace {
    return isModel(workspace.model) && isViews(workspace.views);
}
export function isModel(model: any): model is IModel {
    return (
        model.groups.every((element: any) => isGroup(element)) &&
        model.people.every((element: any) => isPerson(element)) &&
        model.softwareSystems.every((element: any) =>
            isSoftwareSystem(element)
        ) &&
        model.deploymentEnvironments.every((element: any) =>
            isDeploymentEnvironment(element)
        ) &&
        model.relationships.every((element: any) => isRelationship(element))
    );
}
export function isViews(views: any): views is IViews {
    return (
        views.systemContexts.every((view: any) => isSystemContextView(view)) &&
        views.containers.every((view: any) => isContainerView(view)) &&
        views.components.every((view: any) => isComponentView(view)) &&
        views.deployments.every((view: any) => isDeploymentView(view))
    );
}
export function isElement(element: any): element is IElement {
    return element.type !== undefined && element.identifier !== undefined;
}
export function isGroup(group: any): group is IGroup {
    return group.type === ElementType.Group;
}
export function isPerson(person: any): person is IPerson {
    return person.type === ElementType.Person;
}
export function isSoftwareSystem(
    softwareSystem: any
): softwareSystem is ISoftwareSystem {
    return softwareSystem.type === ElementType.SoftwareSystem;
}
export function isContainer(container: any): container is IContainer {
    return container.type === ElementType.Container;
}
export function isComponent(component: any): component is IComponent {
    return component.type === ElementType.Component;
}
export function isDeploymentEnvironment(
    deploymentEnvironment: any
): deploymentEnvironment is IDeploymentEnvironment {
    return deploymentEnvironment !== null;
}
export function isDeploymentNode(
    deploymentNode: any
): deploymentNode is IDeploymentNode {
    return deploymentNode.type === ElementType.DeploymentNode;
}
export function isInfrastructureNode(
    infrastructureNode: any
): infrastructureNode is IInfrastructureNode {
    return infrastructureNode.type === ElementType.InfrastructureNode;
}
export function isSoftwareSystemInstance(
    softwareSystemInstance: any
): softwareSystemInstance is ISoftwareSystemInstance {
    return softwareSystemInstance.type === ElementType.SoftwareSystemInstance;
}
export function isContainerInstance(
    containerInstance: any
): containerInstance is IContainerInstance {
    return containerInstance.type === ElementType.ContainerInstance;
}
export function isRelationship(
    relationship: any
): relationship is IRelationship {
    return relationship.type === RelationshipType.Relationship;
}
export function isSystemLandscapeView(
    systemLandscapeView: any
): systemLandscapeView is ISystemLandscapeView {
    return systemLandscapeView.type === ViewType.SystemLandscape;
}
export function isSystemContextView(
    systemContextView: any
): systemContextView is ISystemContextView {
    return systemContextView.type === ViewType.SystemContext;
}
export function isContainerView(
    containerView: any
): containerView is IContainerView {
    return containerView.type === ViewType.Container;
}
export function isComponentView(
    componentView: any
): componentView is IComponentView {
    return componentView.type === ViewType.Component;
}
export function isDeploymentView(
    deploymentView: any
): deploymentView is IDeploymentView {
    return deploymentView.type === ViewType.Deployment;
}
export function isStyles(styles: any): styles is IStyles {
    return (
        Array.isArray(styles.elements) && Array.isArray(styles.relationships)
    );
}
