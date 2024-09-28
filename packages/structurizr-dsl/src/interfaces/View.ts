import { IComponentView } from "./IComponentView";
import { IContainerView } from "./IContainerView";
import { IDeploymentView } from "./IDeploymentView";
import { IModelView } from "./IModelView";
import { ISystemContextView } from "./ISystemContextView";
import { ISystemLandscapeView } from "./ISystemLandscapeView";

export type View =
    | IModelView
    | ISystemLandscapeView
    | ISystemContextView
    | IContainerView
    | IComponentView
    | IDeploymentView;
