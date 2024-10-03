import { Properties } from "./Properties";
import { ViewType } from "./ViewType";
import { IAutoLayout } from "./IAutoLayout";
import { IAnimation } from "./IAnimation";

export interface IContainerView {
    type: ViewType.Container;
    softwareSystemIdentifier: string;
    key?: string;
    include?: Array<string>;
    exclude?: Array<string>;
    autoLayout?: IAutoLayout;
    animation?: IAnimation;
    title?: string;
    description?: string;
    properties?: Properties;
}
