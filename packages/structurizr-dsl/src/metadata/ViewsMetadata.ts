import { ISupportSnapshot } from "../shared";
import { IViewsMetadata } from "./IViewsMetadata";
import { ViewDefinitionMetadata } from "./ViewDefinitionMetadata";

export class ViewsMetadata implements ISupportSnapshot<IViewsMetadata> {
    constructor(values: IViewsMetadata) {
        this.systemLandscape = values.systemLandscape
            ? new ViewDefinitionMetadata(values.systemLandscape)
            : undefined;
        this.systemContexts =
            values.systemContexts?.map((x) => new ViewDefinitionMetadata(x)) ??
            [];
        this.containers =
            values.containers?.map((x) => new ViewDefinitionMetadata(x)) ?? [];
        this.components =
            values.components?.map((x) => new ViewDefinitionMetadata(x)) ?? [];
        this.deployments =
            values.deployments?.map((x) => new ViewDefinitionMetadata(x)) ?? [];
    }

    public readonly systemLandscape?: ViewDefinitionMetadata;
    public readonly systemContexts: Array<ViewDefinitionMetadata>;
    public readonly containers: Array<ViewDefinitionMetadata>;
    public readonly components: Array<ViewDefinitionMetadata>;
    public readonly deployments: Array<ViewDefinitionMetadata>;

    public toSnapshot(): IViewsMetadata {
        return {
            systemLandscape: this.systemLandscape?.toSnapshot(),
            systemContexts: this.systemContexts.map((x) => x.toSnapshot()),
            containers: this.containers.map((x) => x.toSnapshot()),
            components: this.components.map((x) => x.toSnapshot()),
            deployments: this.deployments.map((x) => x.toSnapshot()),
        };
    }
}
