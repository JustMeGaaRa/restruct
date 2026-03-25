import {
    IContainer,
    ISoftwareSystem,
    IPerson,
    IComponentDiagramBuilder,
    IRelationship,
} from "../../interfaces";
import { IDiagramVisitor } from "../../shared";

export class ComponentDiagramVisitor
    implements
        IDiagramVisitor<IContainer, ISoftwareSystem | IContainer | IPerson>
{
    constructor(public builder: IComponentDiagramBuilder) {}

    visitScopeElement(scope: IContainer): void {
        this.builder.setScope(scope);
    }

    visitSupportingElement(
        supportingElement: ISoftwareSystem | IContainer | IPerson
    ): void {
        this.builder.addSupportingElement(supportingElement);
    }

    visitRelationship(relationship: IRelationship): void {
        this.builder.addRelationship(relationship);
    }
}
