import { IAnimation } from "./IAnimation";
import { IAutoLayout } from "./IAutoLayout";
import { Properties } from "./Properties";
import { All } from "./Identifier";
import { ViewType } from "./ViewType";

export interface ISystemContextView {
    type: ViewType.SystemContext;
    softwareSystemIdentifier: string;
    key?: string;
    include?: Array<string | All>;
    exclude?: Array<string>;
    autoLayout?: IAutoLayout;
    animation?: IAnimation;
    title?: string;
    description?: string;
    properties?: Properties;
}
