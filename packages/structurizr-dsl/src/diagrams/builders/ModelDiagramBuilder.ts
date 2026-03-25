import {
    IComponent,
    IContainer,
    IModelDiagram,
    IModelDiagramBuilder,
    IModelView,
    IPerson,
    IRelationship,
    ISoftwareSystem,
} from "../../interfaces";

export class ModelDiagramBuilder implements IModelDiagramBuilder {
    private diagram: IModelDiagram;

    constructor(view: IModelView) {
        this.diagram = {
            key: view.key,
            scope: {} as any,
            supportingElements: [],
            relationships: [],
        };
    }

    build(): IModelDiagram {
        return this.diagram;
    }

    addSupportingElement(
        supportingElement: ISoftwareSystem | IContainer | IComponent | IPerson
    ): void {
        this.diagram.supportingElements.push(supportingElement);
    }

    addRelationship(relationship: IRelationship): void {
        this.diagram.relationships.push(relationship);
    }
}
