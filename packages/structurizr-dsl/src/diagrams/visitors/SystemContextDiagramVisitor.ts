import {
    ISoftwareSystem,
    IPerson,
    ISystemContextDiagramBuilder,
    IRelationship,
} from "../../interfaces";
import { IDiagramVisitor } from "../../shared";

export class SystemContextDiagramVisitor
    implements IDiagramVisitor<ISoftwareSystem, ISoftwareSystem | IPerson>
{
    constructor(private builder: ISystemContextDiagramBuilder) {}

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
