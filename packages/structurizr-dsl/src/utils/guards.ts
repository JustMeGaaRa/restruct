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
} from "../interfaces";

export function isWorkspace(workspace: any): workspace is IWorkspace {
    throw new Error("Not implemented");
}
export function isGroup(group: any): group is IGroup {
    throw new Error("Not implemented");
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
    throw new Error("Not implemented");
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
    throw new Error("Not implemented");
}
// export function isElementStyle (elementStyle: any): elementStyle is IElementStyle { throw new Error("Not implemented"); }
// export function isRelationshipStyle (relationshipStyle: any): relationshipStyle is IRelationshipStyle { throw new Error("Not implemented"); }
