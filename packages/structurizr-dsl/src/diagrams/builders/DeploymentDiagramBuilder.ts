import {
    IContainer,
    IContainerInstance,
    IDeploymentDiagram,
    IDeploymentDiagramBuilder,
    IDeploymentEnvironment,
    IDeploymentNode,
    IDeploymentView,
    IInfrastructureNode,
    IRelationship,
    ISoftwareSystem,
    ISoftwareSystemInstance,
} from "../../interfaces";

export class DeploymentDiagramBuilder implements IDeploymentDiagramBuilder {
    private diagram: IDeploymentDiagram;

    constructor(view: IDeploymentView) {
        this.diagram = {
            key: view.key,
            scope: {} as any,
            supportingElements: [],
            relationships: [],
        };
    }

    build(): IDeploymentDiagram {
        return this.diagram;
    }

    setScope(scope: IDeploymentEnvironment): void {
        this.diagram.scope = scope;
    }

    addSupportingElement(
        supportingElement:
            | IDeploymentNode
            | IInfrastructureNode
            | ISoftwareSystemInstance
            | IContainerInstance
            | ISoftwareSystem
            | IContainer
    ): void {
        this.diagram.supportingElements.push(supportingElement);
    }

    addRelationship(relationship: IRelationship): void {
        this.diagram.relationships.push(relationship);
    }
}
