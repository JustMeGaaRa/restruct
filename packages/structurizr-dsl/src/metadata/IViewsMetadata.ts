import { IViewDefinitionMetadata } from "./IViewDefinitionMetadata";

export interface IViewsMetadata {
    systemLandscape?: IViewDefinitionMetadata;
    systemContexts: Array<IViewDefinitionMetadata>;
    containers: Array<IViewDefinitionMetadata>;
    components: Array<IViewDefinitionMetadata>;
    deployments: Array<IViewDefinitionMetadata>;
}
