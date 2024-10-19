import { IRelationship } from "./IRelationship";

export interface IDiagram<TScope, TSupporting> {
    scope: TScope;
    supportingElements: Array<TSupporting>;
    relationships: Array<IRelationship>;
}
