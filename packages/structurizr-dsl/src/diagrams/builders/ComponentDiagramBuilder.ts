import {
    IComponentDiagram,
    IComponentDiagramBuilder,
    IComponentView,
} from "../../interfaces";
import {
    IContainer,
    IPerson,
    IRelationship,
    ISoftwareSystem,
} from "../../interfaces";

export class ComponentDiagramBuilder implements IComponentDiagramBuilder {
    private diagram: IComponentDiagram;

    constructor(view: IComponentView) {
        this.diagram = {
            key: view.key,
            scope: {} as any,
            supportingElements: [],
            relationships: [],
        };
    }

    build(): IComponentDiagram {
        return this.diagram;
    }

    setScope(scope: IContainer): void {
        this.diagram.scope = scope;
    }

    addSupportingElement(
        supportingElement: ISoftwareSystem | IContainer | IPerson
    ): void {
        this.diagram.supportingElements.push(supportingElement);
    }

    addRelationship(relationship: IRelationship): void {
        this.diagram.relationships.push(relationship);
    }
}
