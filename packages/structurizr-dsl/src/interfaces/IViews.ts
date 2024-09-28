import { IComponentView } from "./IComponentView";
import { IConfiguration } from "./IConfiguration";
import { IContainerView } from "./IContainerView";
import { IDeploymentView } from "./IDeploymentView";
import { ISystemContextView } from "./ISystemContextView";
import { ISystemLandscapeView } from "./ISystemLandscapeView";

export interface IViews {
    systemLandscape?: ISystemLandscapeView;
    systemContexts: ISystemContextView[];
    containers: IContainerView[];
    components: IComponentView[];
    deployments: IDeploymentView[];
    configuration: IConfiguration;
}
