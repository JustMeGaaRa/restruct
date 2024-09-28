import { ITag } from "./ITag";
import { Identifier } from "./Identifier";
import { Url } from "./Url";
import { RelationshipType } from "./RelationshipType";

export interface IRelationship {
    type: RelationshipType.Relationship;
    sourceIdentifier: Identifier;
    targetIdentifier: Identifier;
    description?: string;
    technology?: string[];
    tags: ITag[];
    url?: Url;
}
