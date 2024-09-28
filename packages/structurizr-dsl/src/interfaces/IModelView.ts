import { ViewType } from "./ViewType";
import { IAutoLayout } from "./IAutoLayout";

export interface IModelView {
    type: ViewType.Model;
    key: string;
    autoLayout?: IAutoLayout;
}
