import {
    IModel,
    IRelationship,
    ISystemLandscapeDiagram,
    ISystemLandscapeDiagramBuilder,
    ISystemLandscapeView,
} from "../../interfaces";

export class SystemLandscapeDiagramBuilder
    implements ISystemLandscapeDiagramBuilder
{
    private diagram: ISystemLandscapeDiagram;

    constructor(view: ISystemLandscapeView) {
        this.diagram = {
            key: view.key,
            scope: {} as any,
            supportingElements: [],
            relationships: [],
        };
    }

    build(): ISystemLandscapeDiagram {
        return this.diagram;
    }

    setScope(scope: IModel): void {
        this.diagram.scope = scope;
    }

    addRelationship(relationship: IRelationship): void {
        this.diagram.relationships.push(relationship);
    }
}
