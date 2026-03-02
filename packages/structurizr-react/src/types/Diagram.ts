import {
    IComponentDiagram,
    IContainerDiagram,
    IDeploymentDiagram,
    IModelDiagram,
    ISystemContextDiagram,
    ISystemLandscapeDiagram,
} from "@structurizr/dsl";

export type Diagram =
    | ISystemLandscapeDiagram
    | ISystemContextDiagram
    | IContainerDiagram
    | IComponentDiagram
    | IDeploymentDiagram
    | IModelDiagram;
