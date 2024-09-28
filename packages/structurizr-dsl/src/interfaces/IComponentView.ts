import { ViewType } from "./ViewType";
import { All, Identifier } from "./Identifier";
import { Properties } from "./Properties";
import { IAutoLayout } from "./IAutoLayout";
import { IAnimation } from "./IAnimation";

export interface IComponentView {
    type: ViewType.Component;
    containerIdentifier: Identifier;
    key?: string;
    include?: Array<Identifier | All>;
    exclude?: Array<Identifier>;
    autoLayout?: IAutoLayout;
    animation?: IAnimation;
    title?: string;
    description?: string;
    properties?: Properties;
}
