import { Properties } from "./Properties";
import { IViews } from "./IViews";
import { IModel } from "./IModel";

export interface IWorkspace {
    version: number;
    lastModifiedDate?: string;
    name?: string;
    description?: string;
    properties?: Properties;
    model: IModel;
    views: IViews;
}
