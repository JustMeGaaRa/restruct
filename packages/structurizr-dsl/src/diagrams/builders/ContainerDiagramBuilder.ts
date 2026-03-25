import {
    IContainerDiagram,
    IContainerDiagramBuilder,
    IContainerView,
    IPerson,
    IRelationship,
    ISoftwareSystem,
} from "../../interfaces";

export class ContainerDiagramBuilder implements IContainerDiagramBuilder {
    private diagram: IContainerDiagram;

    constructor(view: IContainerView) {
        this.diagram = {
            key: view.key,
            scope: {} as any,
            supportingElements: [],
            relationships: [],
        };
    }

    build(): IContainerDiagram {
        return this.diagram;
    }

    setScope(scope: ISoftwareSystem): void {
        this.diagram.scope = scope;
    }

    addSupportingElement(supportingElement: ISoftwareSystem | IPerson): void {
        this.diagram.supportingElements.push(supportingElement);
    }

    addRelationship(relationship: IRelationship): void {
        this.diagram.relationships.push(relationship);
    }
}
