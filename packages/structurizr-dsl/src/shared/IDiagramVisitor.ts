import { IRelationship } from "../interfaces";

export interface IDiagramVisitor<TScope, TSupporting> {
    visitScopeElement?: (scope: TScope) => void;
    visitSupportingElement?: (supportingElement: TSupporting) => void;
    visitRelationship?: (relationship: IRelationship) => void;
}
