import { AutoLayoutDirection, IAutoLayout } from "../interfaces";
import { ISupportSnapshot } from "../shared";

export class AutoLayout implements ISupportSnapshot<IAutoLayout> {
    constructor(values?: IAutoLayout) {
        this.direction = values?.direction ?? AutoLayoutDirection.TopBotom;
        this.rankSeparation = values?.rankSeparation ?? 300;
        this.nodeSeparation = values?.nodeSeparation ?? 300;
    }

    public readonly direction: AutoLayoutDirection;
    public readonly rankSeparation: number;
    public readonly nodeSeparation: number;

    public toSnapshot(): IAutoLayout {
        return {
            direction: this.direction,
            rankSeparation: this.rankSeparation,
            nodeSeparation: this.nodeSeparation,
        };
    }
}
