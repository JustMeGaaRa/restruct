import {
    IComponentDiagram,
    IContainerDiagram,
    IModelDiagram,
    ISystemContextDiagram,
    ISystemLandscapeDiagram,
} from "@structurizr/dsl";

export type Diagram =
    | ISystemLandscapeDiagram
    | ISystemContextDiagram
    | IContainerDiagram
    | IComponentDiagram
    | IModelDiagram;
