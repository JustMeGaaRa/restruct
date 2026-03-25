import {
    IModelDiagramBuilder,
    IWorkspace,
    ISoftwareSystem,
    IContainer,
    IComponent,
    IPerson,
    IRelationship,
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
