import { All, Identifier } from "./Identifier";
import { Properties } from "./Properties";
import { ViewType } from "./ViewType";
import { IAutoLayout } from "./IAutoLayout";
import { IAnimation } from "./IAnimation";

export interface IContainerView {
    type: ViewType.Container;
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
