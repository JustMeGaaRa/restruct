import { ISupportSnapshot } from "../shared";
import { IElementMetadata } from "./IElementMetadata";
import { IRelationshipMetadata } from "./IRelationshipMetadata";
import { IViewDefinitionMetadata } from "./IViewDefinitionMetadata";
import { Position } from "./Position";

export class ViewDefinitionMetadata
    implements ISupportSnapshot<IViewDefinitionMetadata>
{
    constructor(values: IViewDefinitionMetadata) {
        this.key = values.key;
        this.elements = values.elements ?? [];
        this.relationships = values.relationships ?? [];
    }

    public key?: string;
    public elements: Array<IElementMetadata>;
    public relationships: Array<IRelationshipMetadata>;

    public toSnapshot(): IViewDefinitionMetadata {
        return {
            key: this.key,
            elements: this.elements,
            relationships: this.relationships,
        };
    }

    public setElementPosition(elementId: string, position: Position) {
        this.elements = [
            ...this.elements.filter((x) => x.id !== elementId),
            { id: elementId, x: position.x, y: position.y },
        ];
    }

    public setRelationshipPosition(relationshipId: string) {
        this.relationships = [
            ...this.relationships.filter((x) => x.id !== relationshipId),
            { id: relationshipId, x: 0, y: 0 },
        ];
    }
}
