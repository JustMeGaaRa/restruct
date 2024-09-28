import { ISupportSnapshot } from "../shared";
import { IRelationshipMetadata } from "./IRelationshipMetadata";

export class RelationshipMetadata
    implements ISupportSnapshot<IRelationshipMetadata>
{
    constructor(values: IRelationshipMetadata) {
        this.id = values.id;
        this.x = values.x;
        this.y = values.y;
    }

    public id: string;
    public x: number;
    public y: number;

    public toSnapshot(): IRelationshipMetadata {
        return Object.freeze<IRelationshipMetadata>({
            id: this.id,
            x: this.x,
            y: this.y,
        });
    }
}
