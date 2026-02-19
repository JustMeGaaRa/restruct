import {
    ElementType,
    IComponent,
    IContainer,
    IModelDiagram,
    IModelDiagramBuilder,
    IPerson,
    IRelationship,
    ISoftwareSystem,
    IWorkspace,
} from "../../interfaces";
import { Tag } from "../../models";
import { IElementVisitor } from "../../shared";

export class ModelElementVisitor implements IElementVisitor<unknown> {
    constructor(private builder: IModelDiagramBuilder) {}

    visitWorkspace(workspace: IWorkspace): void {
        this.builder.addSupportingElement({
            type: "Workspace",
            identifier: "workspace",
            name: workspace.name ?? "Workspace",
            tags: [Tag.Workspace],
        });
    }

    visitSoftwareSystem(softwareSystem: ISoftwareSystem): void {
        this.builder.addSupportingElement(softwareSystem);
    }

    visitContainer(container: IContainer): void {
        this.builder.addSupportingElement(container);
    }

    visitComponent(component: IComponent): void {
        this.builder.addSupportingElement(component);
    }

    visitPerson(person: IPerson): void {
        this.builder.addSupportingElement(person);
    }

    visitRelationship(relationship: IRelationship): void {
        this.builder.addRelationship(relationship);
    }
}

export class ModelDiagramBuilder implements IModelDiagramBuilder {
    private diagram: IModelDiagram;

    constructor() {
        this.diagram = {
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
