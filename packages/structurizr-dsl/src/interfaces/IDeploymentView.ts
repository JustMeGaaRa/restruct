import { All } from "./Identifier";
import { Properties } from "./Properties";
import { IAnimation } from "./IAnimation";
import { ViewType } from "./ViewType";
import { IAutoLayout } from "./IAutoLayout";

export interface IDeploymentView {
    type: ViewType.Deployment;
    softwareSystemIdentifier: string;
    environment: string;
    key?: string;
    title?: string;
    description?: string;
    include?: Array<string | All>;
    exclude?: Array<string>;
    autoLayout?: IAutoLayout;
    animation?: IAnimation;
    properties?: Properties;
}
