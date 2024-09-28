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
} from "../interfaces";

export function isWorkspace(workspace: any): workspace is IWorkspace {
    throw new Error("Not implemented");
}
export function isGroup(group: any): group is IGroup {
    throw new Error("Not implemented");
}
export function isPerson(person: any): person is IPerson {
    throw new Error("Not implemented");
}
export function isSoftwareSystem(
    softwareSystem: any
): softwareSystem is ISoftwareSystem {
    throw new Error("Not implemented");
}
export function isContainer(container: any): container is IContainer {
    throw new Error("Not implemented");
}
export function isComponent(component: any): component is IComponent {
    throw new Error("Not implemented");
}
export function isDeploymentEnvironment(
    deploymentEnvironment: any
): deploymentEnvironment is IDeploymentEnvironment {
    throw new Error("Not implemented");
}
export function isDeploymentNode(
    deploymentNode: any
): deploymentNode is IDeploymentNode {
    throw new Error("Not implemented");
}
export function isInfrastructureNode(
    infrastructureNode: any
): infrastructureNode is IInfrastructureNode {
    throw new Error("Not implemented");
}
export function isSoftwareSystemInstance(
    softwareSystemInstance: any
): softwareSystemInstance is ISoftwareSystemInstance {
    throw new Error("Not implemented");
}
export function isContainerInstance(
    containerInstance: any
): containerInstance is IContainerInstance {
    throw new Error("Not implemented");
}
export function isRelationship(
    relationship: any
): relationship is IRelationship {
    throw new Error("Not implemented");
}
export function isSystemLandscapeView(
    systemLandscapeView: any
): systemLandscapeView is ISystemLandscapeView {
    throw new Error("Not implemented");
}
export function isSystemContextView(
    systemContextView: any
): systemContextView is ISystemContextView {
    throw new Error("Not implemented");
}
export function isContainerView(
    containerView: any
): containerView is IContainerView {
    throw new Error("Not implemented");
}
export function isComponentView(
    componentView: any
): componentView is IComponentView {
    throw new Error("Not implemented");
}
export function isDeploymentView(
    deploymentView: any
): deploymentView is IDeploymentView {
    throw new Error("Not implemented");
}
export function isStyles(styles: any): styles is IStyles {
    throw new Error("Not implemented");
}
// export function isElementStyle (elementStyle: any): elementStyle is IElementStyle { throw new Error("Not implemented"); }
// export function isRelationshipStyle (relationshipStyle: any): relationshipStyle is IRelationshipStyle { throw new Error("Not implemented"); }
