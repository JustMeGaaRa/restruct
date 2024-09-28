import { IElementMetadata } from "./IElementMetadata";
import { IRelationshipMetadata } from "./IRelationshipMetadata";

export interface IModelMetadata {
    elements?: Array<IElementMetadata>;
    relationships?: Array<IRelationshipMetadata>;
}
