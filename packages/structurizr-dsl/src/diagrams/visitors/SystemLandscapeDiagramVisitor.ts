import {
    IModel,
    ISystemLandscapeDiagramBuilder,
    IRelationship,
} from "../../interfaces";
import { IDiagramVisitor } from "../../shared";

export class SystemLandscapeDiagramVisitor
    implements IDiagramVisitor<IModel, unknown>
{
    constructor(private builder: ISystemLandscapeDiagramBuilder) {}

    visitScopeElement(scope: IModel): void {
        this.builder.setScope(scope);
    }

    visitRelationship(relationship: IRelationship): void {
        this.builder.addRelationship(relationship);
    }
}
