import { IAnimation } from "./IAnimation";
import { IAutoLayout } from "./IAutoLayout";
import { All } from "./Identifier";
import { Properties } from "./Properties";
import { ViewType } from "./ViewType";

export interface ISystemLandscapeView {
    type: ViewType.SystemLandscape;
    key?: string;
    title?: string;
    description?: string;
    include?: Array<string | All>;
    exclude?: Array<string>;
    autoLayout?: IAutoLayout;
    animation?: IAnimation;
    properties?: Properties;
}
