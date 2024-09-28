import { IViews, Properties } from "../interfaces";
import { ISupportSnapshot } from "../shared";
import { ComponentView } from "./ComponentView";
import { Configuration } from "./Configuration";
import { ContainerView } from "./ContainerView";
import { DeploymentView } from "./DeploymentView";
import { SystemContextView } from "./SystemContextView";
import { SystemLandscapeView } from "./SystemLandscapeView";

export class Views implements ISupportSnapshot<IViews> {
    constructor(params: IViews) {
        this.systemLandscape = params.systemLandscape
            ? new SystemLandscapeView(params.systemLandscape)
            : new SystemLandscapeView({});
        this.systemContexts = params.systemContexts
            ? params.systemContexts.map((s) => new SystemContextView(s))
            : [];
        this.containers = params.containers
            ? params.containers.map((c) => new ContainerView(c))
            : [];
        this.components = params.components
            ? params.components.map((c) => new ComponentView(c))
            : [];
        this.deployments = params.deployments
            ? params.deployments.map((d) => new DeploymentView(d))
            : [];
        this.configuration = params.configuration
            ? new Configuration(params.configuration)
            : new Configuration({});
        // this.properties = params.properties;
    }

    public readonly systemLandscape?: SystemLandscapeView;
    public readonly systemContexts: SystemContextView[];
    public readonly containers: ContainerView[];
    public readonly components: ComponentView[];
    public readonly deployments: DeploymentView[];
    public readonly configuration: Configuration;
    public readonly properties?: Properties;

    public toSnapshot(): IViews {
        return {
            systemLandscape: this.systemLandscape?.toSnapshot(),
            systemContexts: this.systemContexts.map((s) => s.toSnapshot()),
            containers: this.containers.map((c) => c.toSnapshot()),
            components: this.components.map((c) => c.toSnapshot()),
            deployments: this.deployments.map((d) => d.toSnapshot()),
            configuration: this.configuration.toSnapshot(),
            // properties: this.properties
        };
    }
}
