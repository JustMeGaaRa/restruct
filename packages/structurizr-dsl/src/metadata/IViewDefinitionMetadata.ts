import { IElementMetadata } from "./IElementMetadata";
import { IRelationshipMetadata } from "./IRelationshipMetadata";

export interface IViewDefinitionMetadata {
    key?: string;
    elements?: Array<IElementMetadata>;
    relationships?: Array<IRelationshipMetadata>;
}
