import {
    IComponent,
    IContainer,
    IContainerInstance,
    IDeploymentNode,
    IElementVisitor,
    IGroup,
    IInfrastructureNode,
    IPerson,
    IRelationship,
    ISoftwareSystem,
    ISoftwareSystemInstance,
    IWorkspace
} from "@structurizr/dsl";
import {
    Component,
    Container,
    ContainerInstance,
    DeploymentNode,
    Group,
    InfrastructureNode,
    Person,
    Relationship,
    SoftwareSystem,
    SoftwareSystemInstance
} from "../components/diagrams";
import { ZoomCallback } from "./ZoomCallback";

export class ViewElementJsxVisitor implements IElementVisitor<JSX.Element> {
    constructor(
        private readonly onZoomInClick?: ZoomCallback,
        private readonly onZoomOutClick?: ZoomCallback
    ) { }

    visitWorkspace(workspace: IWorkspace, params?: { children?: JSX.Element[]; }): JSX.Element {
        return (<>{params?.children}</>);
    }
    visitGroup(group: IGroup, params?: { parentId?: string; children?: JSX.Element[]; }): JSX.Element {
        return (
            <Group
                key={group.name}
                value={{
                    type: "Group",
                    identifier: group.identifier,
                    name: group.name,
                }}
            >
                {params?.children}
            </Group>
        )
    }
    visitPerson(person: IPerson): JSX.Element {
        return (
            <Person
                key={person.identifier}
                value={{
                    type: "Person",
                    identifier: person.identifier,
                    name: person.name,
                    description: person.description,
                }}
            />
        )
    }
    visitSoftwareSystem(softwareSystem: ISoftwareSystem, params?: { parentId?: string; children?: JSX.Element[]; }): JSX.Element {
        return (
            // <ZoomButtonsHoverPanel
            //     key={softwareSystem.identifier}
            //     zoomIn={Children.count(params?.children) === 0}
            //     zoomOut={Children.count(params?.children) > 0}
            //     onZoomInClick={(event) => this.onZoomInClick?.(event, softwareSystem)}
            //     onZoomOutClick={(event) => this.onZoomOutClick?.(event, softwareSystem)}
            // >
            <SoftwareSystem
                value={{
                    type: "Software System",
                    identifier: softwareSystem.identifier,
                    name: softwareSystem.name,
                    description: softwareSystem.description,
                }}
            >
                {params?.children}
            </SoftwareSystem>
            // </ZoomButtonsHoverPanel>
        );
    }
    visitContainer(container: IContainer, params?: { parentId?: string; children?: JSX.Element[]; }): JSX.Element {
        return (
            // <ZoomButtonsHoverPanel
            //     key={container.identifier}
            //     zoomIn={Children.count(params?.children) === 0}
            //     zoomOut={Children.count(params?.children) > 0}
            //     onZoomInClick={(event) => this.onZoomInClick?.(event, container)}
            //     onZoomOutClick={(event) => this.onZoomOutClick?.(event, container)}
            // >
            <Container
                value={{
                    type: "Container",
                    identifier: container.identifier,
                    name: container.name,
                    description: container.description,
                    technology: container.technology.join(", ")
                }}
            >
                {params?.children}
            </Container>
            // </ZoomButtonsHoverPanel>
        );
    }
    visitComponent(component: IComponent): JSX.Element {
        return (
            <Component
                key={component.identifier}
                value={{
                    type: "Component",
                    identifier: component.identifier,
                    name: component.name,
                    description: component.description,
                    technology: component.technology.join(", ")
                }}
            />
        );
    }
    visitDeploymentNode(deploymentNode: IDeploymentNode, params?: { parentId?: string; children?: JSX.Element[]; }): JSX.Element {
        return (
            <DeploymentNode
                key={deploymentNode.identifier}
                value={{
                    type: "Deployment Node",
                    identifier: deploymentNode.identifier,
                    name: deploymentNode.name,
                    description: deploymentNode.description,
                    instances: deploymentNode.instances ? `x${deploymentNode.instances}` : undefined
                }}
            >
                {params?.children}
            </DeploymentNode>
        );
    }
    visitInfrastructureNode(infrastructureNode: IInfrastructureNode): JSX.Element {
        return (
            <InfrastructureNode
                key={infrastructureNode.identifier}
                value={{
                    type: "Infrastructure Node",
                    identifier: infrastructureNode.identifier,
                    name: infrastructureNode.name,
                    description: infrastructureNode.description,
                }}
            />
        )
    }
    visitSoftwareSystemInstance(softwareSystemInstance: ISoftwareSystemInstance, params?: { parentId?: string; children?: JSX.Element[]; }): JSX.Element {
        return (
            <SoftwareSystemInstance
                key={softwareSystemInstance.identifier}
                value={{
                    type: "Software System Instance",
                    identifier: softwareSystemInstance.identifier,
                    softwareSystemIdentifier: softwareSystemInstance.softwareSystemIdentifier,
                }}
            >
                {params?.children}
            </SoftwareSystemInstance>
        )
    }
    visitContainerInstance(containerInstance: IContainerInstance, params?: { parentId?: string; children?: JSX.Element[]; }): JSX.Element {
        return (
            <ContainerInstance
                key={containerInstance.identifier}
                value={{
                    type: "Container Instance",
                    identifier: containerInstance.identifier,
                    containerIdentifier: containerInstance.containerIdentifier,
                }}
            >
                {params?.children}
            </ContainerInstance>
        )
    }
    visitRelationship(relationship: IRelationship): JSX.Element {
        return (
            <Relationship
                key={`${relationship.sourceIdentifier}_${relationship.targetIdentifier}`}
                value={{
                    identifier: `${relationship.sourceIdentifier}_${relationship.targetIdentifier}`,
                    sourceIdentifier: relationship.sourceIdentifier,
                    targetIdentifier: relationship.targetIdentifier,
                    description: relationship.description,
                }}
            />
        )
    }
}