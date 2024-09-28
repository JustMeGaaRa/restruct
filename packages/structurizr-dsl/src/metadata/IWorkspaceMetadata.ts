import { IViewsMetadata } from "./IViewsMetadata";

export interface IWorkspaceMetadata {
    name: string;
    lastModifiedDate: Date;
    views: IViewsMetadata;
}
