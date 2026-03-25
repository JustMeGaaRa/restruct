import {
    ISoftwareSystem,
    IPerson,
    IContainerDiagramBuilder,
    IRelationship,
} from "../../interfaces";
import { IDiagramVisitor } from "../../shared";

export class ContainerDiagramVisitor
    implements IDiagramVisitor<ISoftwareSystem, ISoftwareSystem | IPerson>
{
    constructor(public builder: IContainerDiagramBuilder) {}

    visitScopeElement(scope: ISoftwareSystem): void {
        this.builder.setScope(scope);
    }

    visitSupportingElement(supportingElement: ISoftwareSystem | IPerson): void {
        this.builder.addSupportingElement(supportingElement);
    }

    visitRelationship(relationship: IRelationship): void {
        this.builder.addRelationship(relationship);
    }
}
