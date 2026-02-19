import {
    IComponentDiagram,
    IContainerDiagram,
    ISystemContextDiagram,
    ISystemLandscapeDiagram,
} from "@structurizr/dsl";

export type Diagram =
    | ISystemLandscapeDiagram
    | ISystemContextDiagram
    | IContainerDiagram
    | IComponentDiagram;
