import { ITheme } from "../interfaces";
import { ISupportSnapshot } from "../shared";
import { ElementStyleCollection, RelationshipStyleCollection } from "./Style";

export class Theme implements ISupportSnapshot<ITheme> {
    constructor(param: Partial<ITheme> = {}) {
        this.name = param.name ?? "Unknown Theme";
        this.description = param.description ?? "";
        this.elements = param.elements ?? [];
        this.relationships = param.relationships ?? [];
    }

    public readonly name: string;
    public readonly description: string;
    public readonly elements: ElementStyleCollection;
    public readonly relationships: RelationshipStyleCollection;

    public toSnapshot(): ITheme {
        return {
            name: this.name,
            description: this.description,
            elements: this.elements,
            relationships: this.relationships,
        };
    }
}
