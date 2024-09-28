import { ISupportSnapshot } from "../shared";
import { IElementMetadata } from "./IElementMetadata";

export class ElementMetadata implements ISupportSnapshot<IElementMetadata> {
    constructor(values: IElementMetadata) {
        this.id = values.id;
        this.x = values.x;
        this.y = values.y;
        this.height = values.height;
        this.width = values.width;
    }

    public id: string;
    public x: number;
    public y: number;
    public height?: number;
    public width?: number;

    public toSnapshot(): IElementMetadata {
        return Object.freeze<IElementMetadata>({
            id: this.id,
            x: this.x,
            y: this.y,
            height: this.height,
            width: this.width,
        });
    }
}
