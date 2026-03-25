import {
    IPerson,
    IRelationship,
    ISoftwareSystem,
    ISystemContextDiagram,
    ISystemContextDiagramBuilder,
    ISystemContextView,
} from "../../interfaces";

export class SystemContextDiagramBuilder
    implements ISystemContextDiagramBuilder
{
    private diagram: ISystemContextDiagram;

    constructor(view: ISystemContextView) {
        this.diagram = {
            key: view.key,
            scope: {} as any,
            supportingElements: [],
            relationships: [],
        };
    }

    build(): ISystemContextDiagram {
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
