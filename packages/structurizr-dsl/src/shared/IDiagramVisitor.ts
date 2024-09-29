import { IRelationship } from "../interfaces";

export interface IDiagramVisitor<TScope, TPrimary, TSupporting> {
    visitorScopeElement(scope: TScope): void;
    visitPrimaryElement(primaryElement: TPrimary): void;
    visitSupportingElement(supportingElement: TSupporting): void;
    visitRelationship(relationship: IRelationship): void;
}
