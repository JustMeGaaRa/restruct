import { ViewType } from "./ViewType";
import { All } from "./Identifier";
import { Properties } from "./Properties";
import { IAutoLayout } from "./IAutoLayout";
import { IAnimation } from "./IAnimation";

export interface IComponentView {
    type: ViewType.Component;
    containerIdentifier: string;
    key?: string;
    include?: Array<string | All>;
    exclude?: Array<string>;
    autoLayout?: IAutoLayout;
    animation?: IAnimation;
    title?: string;
    description?: string;
    properties?: Properties;
}
