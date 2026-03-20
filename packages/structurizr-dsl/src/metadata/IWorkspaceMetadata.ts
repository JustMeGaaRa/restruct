import { IViewsMetadata } from "./IViewsMetadata";

export interface IWorkspaceMetadata {
    name: string;
    lastModifiedDate: Date;
    authors?: string[];
    views: IViewsMetadata;
}
