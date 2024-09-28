import { IAnimation } from "./IAnimation";
import { IAutoLayout } from "./IAutoLayout";
import { All, Identifier } from "./Identifier";
import { Properties } from "./Properties";
import { ViewType } from "./ViewType";

export interface ISystemLandscapeView {
    type: ViewType.SystemLandscape;
    key?: string;
    title?: string;
    description?: string;
    include?: Array<Identifier | All>;
    exclude?: Array<Identifier>;
    autoLayout?: IAutoLayout;
    animation?: IAnimation;
    properties?: Properties;
}
