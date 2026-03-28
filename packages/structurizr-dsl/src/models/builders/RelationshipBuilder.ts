import { IRelationship } from "../../interfaces";
import { Relationship } from "../Relationship";

export class RelationshipBuilder {
    private relationship: IRelationship;

    constructor(source: string, target: string, description?: string) {
        this.relationship = new Relationship({
            sourceIdentifier: source,
            targetIdentifier: target,
            description,
        }).toSnapshot();
    }

    technology(...technology: string[]): this {
        this.relationship = new Relationship({
            ...this.relationship,
            technology: [
                ...(this.relationship.technology || []),
                ...technology,
            ],
        }).toSnapshot();
        return this;
    }

    tags(...tags: string[]): this {
        this.relationship = new Relationship({
            ...this.relationship,
            tags: [
                ...(this.relationship.tags || []),
                ...tags.map((tag) => ({ name: tag })),
            ],
        }).toSnapshot();
        return this;
    }

    build(): IRelationship {
        return this.relationship;
    }
}
