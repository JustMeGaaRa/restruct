import { IAnimation } from "./IAnimation";
import { IAutoLayout } from "./IAutoLayout";
import { Properties } from "./Properties";
import { All, Identifier } from "./Identifier";
import { ViewType } from "./ViewType";

export interface ISystemContextView {
    type: ViewType.SystemContext;
    softwareSystemIdentifier: Identifier;
    key?: string;
    include?: Array<Identifier | All>;
    exclude?: Array<Identifier>;
    autoLayout?: IAutoLayout;
    animation?: IAnimation;
    title?: string;
    description?: string;
    properties?: Properties;
}
