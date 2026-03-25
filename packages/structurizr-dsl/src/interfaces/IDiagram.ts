import { IRelationship } from "./IRelationship";

export interface IDiagram<TScope, TSupporting> {
    key: string;
    scope: TScope;
    supportingElements: Array<TSupporting>;
    relationships: Array<IRelationship>;
}
