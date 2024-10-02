import { IRelationship } from "./IRelationship";

export interface IDiagram<TScope, TPrimary, TSupporting> {
    scope: TScope;
    primaryElements: Array<TPrimary>;
    supportingElements: Array<TSupporting>;
    relationships: Array<IRelationship>;
}
