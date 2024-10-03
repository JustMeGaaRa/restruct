import { ITag } from "./ITag";
import { Url } from "./Url";
import { RelationshipType } from "./RelationshipType";

export interface IRelationship {
    type: RelationshipType.Relationship;
    identifier: string;
    sourceIdentifier: string;
    targetIdentifier: string;
    description?: string;
    technology?: string[];
    tags: ITag[];
    url?: Url;
}
