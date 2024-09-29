import {
    IContainer,
    IRelationship,
    ISoftwareSystem,
    IWorkspace,
    Identifier,
    IGroup,
    IPerson,
    IComponent,
    IDeploymentNode,
    IInfrastructureNode,
    ISystemLandscapeView,
    AutoLayoutDirection,
    ISystemContextView,
    IContainerView,
    IComponentView,
    IDeploymentView,
    IModelView,
    IConfiguration,
    ElementType,
    ViewType,
} from "@structurizr/dsl";
import {
    Component,
    ComponentView,
    Configuration,
    Container,
    ContainerView,
    DeploymentNode,
    DeploymentView,
    Group,
    InfrastructureNode,
    Person,
    Relationship,
    SoftwareSystem,
    SystemContextView,
    SystemLandscapeView,
} from "@structurizr/dsl";
import { v4 } from "uuid";

export const createDefaultGroup = (): IGroup => {
    const uniqueId = new String(v4()).substring(0, 8);
    return new Group({
        identifier: `group_${uniqueId}`,
        name: "Group",
    }).toSnapshot();
};

export const createDefaultSoftwareSystem = (): ISoftwareSystem => {
    const uniqueId = new String(v4()).substring(0, 8);
    return new SoftwareSystem({
        identifier: `softwareSystem_${uniqueId}`,
        name: "Software System",
    }).toSnapshot();
};

export const createDefaultContainer = (): IContainer => {
    const uniqueId = new String(v4()).substring(0, 8);
    return new Container({
        identifier: `container_${uniqueId}`,
        name: "Container",
    }).toSnapshot();
};

export const createDefaultComponent = (): IComponent => {
    const uniqueId = new String(v4()).substring(0, 8);
    return new Component({
        identifier: `component_${uniqueId}`,
        name: "Component",
    }).toSnapshot();
};

export const createDefaultPerson = (): IPerson => {
    const uniqueId = new String(v4()).substring(0, 8);
    return new Person({
        identifier: `person_${uniqueId}`,
        name: "Person",
    }).toSnapshot();
};

export const createDefaultDeploymentNode = (): IDeploymentNode => {
    const uniqueId = new String(v4()).substring(0, 8);
    return new DeploymentNode({
        identifier: `deployment_node_${uniqueId}`,
        name: "Deployment Node",
    }).toSnapshot();
};

export const createDefaultInfrastructureNode = (): IInfrastructureNode => {
    const uniqueId = new String(v4()).substring(0, 8);
    return new InfrastructureNode({
        identifier: `infrastructure_node_${uniqueId}`,
        name: "Infrastructure Node",
    }).toSnapshot();
};

export const createRelationship = (
    sourceIdentifier: Identifier,
    targetIdentifier: Identifier
): IRelationship => {
    return new Relationship({
        sourceIdentifier,
        targetIdentifier,
    }).toSnapshot();
};

export const createDefaultSystemLandscapeView = (): ISystemLandscapeView => {
    const uniqueId = new String(v4()).substring(0, 8);
    return new SystemLandscapeView({
        key: `system_landscape_view_${uniqueId}`,
        title: "System Landscape",
        description: "Default system landscape view.",
        autoLayout: {
            direction: AutoLayoutDirection.TopBotom,
            rankSeparation: 300,
            nodeSeparation: 300,
        },
    }).toSnapshot();
};

export const createDefaultSystemContextView = (
    softwareSystemIdentifier: Identifier
): ISystemContextView => {
    const uniqueId = new String(v4()).substring(0, 8);
    return new SystemContextView({
        softwareSystemIdentifier,
        key: `system_context_view_${uniqueId}`,
        title: "System Context",
        autoLayout: {
            direction: AutoLayoutDirection.TopBotom,
            rankSeparation: 300,
            nodeSeparation: 300,
        },
    }).toSnapshot();
};

export const createDefaultContainerView = (
    softwareSystemIdentifier: Identifier
): IContainerView => {
    const uniqueId = new String(v4()).substring(0, 8);
    return new ContainerView({
        softwareSystemIdentifier,
        key: `container_view_${uniqueId}`,
        title: "Container",
        autoLayout: {
            direction: AutoLayoutDirection.TopBotom,
            rankSeparation: 300,
            nodeSeparation: 300,
        },
    }).toSnapshot();
};

export const createDefaultComponentView = (
    containerIdentifier: Identifier
): IComponentView => {
    const uniqueId = new String(v4()).substring(0, 8);
    return new ComponentView({
        containerIdentifier,
        key: `component_view_${uniqueId}`,
        title: "Component",
        autoLayout: {
            direction: AutoLayoutDirection.TopBotom,
            rankSeparation: 300,
            nodeSeparation: 300,
        },
    }).toSnapshot();
};

export const createDefaultDeploymentView = (): IDeploymentView => {
    const uniqueId = new String(v4()).substring(0, 8);
    return new DeploymentView({
        // TODO: inintialize with proper identifier
        softwareSystemIdentifier: "...",
        environment: "New Environment",
        key: `deployment_view_${uniqueId}`,
        title: "Deployment for New Environment",
        autoLayout: {
            direction: AutoLayoutDirection.TopBotom,
            rankSeparation: 300,
            nodeSeparation: 300,
        },
    }).toSnapshot();
};

export const createDefaultModelView = (): IModelView => {
    return {
        type: ViewType.Model,
        key: "model_view",
    };
};

export const createDefaultConfiguration = (): IConfiguration => {
    return new Configuration({
        styles: {
            elements: [],
            relationships: [],
        },
        themes: [],
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
    const uniqueId = new String(v4()).substring(0, 8);

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

export const createDefaultWorkspace = (): IWorkspace => {
    return {
        version: 1,
        lastModifiedDate: new Date().toISOString(),
        name: "Workspace",
        description: "An empty workspace with default values.",
        model: {
            people: [],
            softwareSystems: [],
            deploymentEnvironments: [],
            relationships: [],
            groups: [],
        },
        views: {
            systemLandscape: createDefaultSystemLandscapeView(),
            systemContexts: [],
            containers: [],
            components: [],
            deployments: [],
            configuration: createDefaultConfiguration(),
        },
    };
};
