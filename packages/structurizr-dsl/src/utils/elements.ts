import {
    IContainer,
    ISoftwareSystem,
    IGroup,
    IPerson,
    IComponent,
    IDeploymentNode,
    IInfrastructureNode,
    ElementType,
} from "../interfaces";
import {
    Component,
    Container,
    DeploymentNode,
    Group,
    InfrastructureNode,
    Person,
    SoftwareSystem,
} from "../models";
import { createUniqueId } from "./identifier";

export const isElementExplicitlyIncludedInView = (
    view: { include?: string[] },
    elementIdentifier: string
) => {
    // TODO (configuration): all elements are included for asterisk isntead of scoped ones
    return (
        view.include?.includes(elementIdentifier) ||
        view.include?.includes("*") ||
        false
    );
};

export const createDefaultGroup = (): IGroup => {
    const uniqueId = createUniqueId();
    return new Group({
        identifier: `group_${uniqueId}`,
        name: "Group",
    }).toSnapshot();
};

export const createDefaultSoftwareSystem = (): ISoftwareSystem => {
    const uniqueId = createUniqueId();
    return new SoftwareSystem({
        identifier: `softwareSystem_${uniqueId}`,
        name: "Software System",
    }).toSnapshot();
};

export const createDefaultContainer = (): IContainer => {
    const uniqueId = createUniqueId();
    return new Container({
        identifier: `container_${uniqueId}`,
        name: "Container",
    }).toSnapshot();
};

export const createDefaultComponent = (): IComponent => {
    const uniqueId = createUniqueId();
    return new Component({
        identifier: `component_${uniqueId}`,
        name: "Component",
    }).toSnapshot();
};

export const createDefaultPerson = (): IPerson => {
    const uniqueId = createUniqueId();
    return new Person({
        identifier: `person_${uniqueId}`,
        name: "Person",
    }).toSnapshot();
};

export const createDefaultDeploymentNode = (): IDeploymentNode => {
    const uniqueId = createUniqueId();
    return new DeploymentNode({
        identifier: `deployment_node_${uniqueId}`,
        name: "Deployment Node",
    }).toSnapshot();
};

export const createDefaultInfrastructureNode = (): IInfrastructureNode => {
    const uniqueId = createUniqueId();
    return new InfrastructureNode({
        identifier: `infrastructure_node_${uniqueId}`,
        name: "Infrastructure Node",
    }).toSnapshot();
};

export const getDefaultElement = (
    type: ElementType
):
    | IGroup
    | ISoftwareSystem
    | IContainer
    | IComponent
    | IPerson
    | IDeploymentNode
    | IInfrastructureNode
    | undefined => {
    switch (type) {
        case ElementType.Group:
            return createDefaultGroup();
        case ElementType.SoftwareSystem:
            return createDefaultSoftwareSystem();
        case ElementType.Container:
            return createDefaultContainer();
        case ElementType.Component:
            return createDefaultComponent();
        case ElementType.Person:
            return createDefaultPerson();
        case ElementType.DeploymentNode:
            return createDefaultDeploymentNode();
        case ElementType.InfrastructureNode:
            return createDefaultInfrastructureNode();
        default:
            return undefined;
    }
};

export const getDefaultChildForElement = (
    parentType?: ElementType
): ISoftwareSystem | IContainer | IComponent => {
    const uniqueId = createUniqueId();

    switch (parentType) {
        case ElementType.SoftwareSystem:
            return new Container({
                identifier: `container_${uniqueId}`,
                name: "Container",
            }).toSnapshot();
        case ElementType.Container:
            return new Component({
                identifier: `component_${uniqueId}`,
                name: "Component",
            }).toSnapshot();
    }

    return new SoftwareSystem({
        identifier: `softwareSystem_${uniqueId}`,
        name: "Software System",
    }).toSnapshot();
};
