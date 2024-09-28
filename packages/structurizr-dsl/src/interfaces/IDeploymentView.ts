import { All, Identifier } from "./Identifier";
import { Properties } from "./Properties";
import { IAnimation } from "./IAnimation";
import { ViewType } from "./ViewType";
import { IAutoLayout } from "./IAutoLayout";

export interface IDeploymentView {
    type: ViewType.Deployment;
    softwareSystemIdentifier: Identifier;
    environment: string;
    key?: string;
    title?: string;
    description?: string;
    include?: Array<Identifier | All>;
    exclude?: Array<Identifier>;
    autoLayout?: IAutoLayout;
    animation?: IAnimation;
    properties?: Properties;
}
