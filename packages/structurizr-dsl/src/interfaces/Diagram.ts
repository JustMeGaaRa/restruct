import { ISystemLandscapeDiagram } from "./ISystemLandscapeDiagram";
import { ISystemContextDiagram } from "./ISystemContextDiagram";
import { IContainerDiagram } from "./IContainerDiagram";
import { IComponentDiagram } from "./IComponentDiagram";
import { IDeploymentDiagram } from "./IDeploymentDiagram";
import { IModelDiagram } from "./IModelDiagram";

export type Diagram =
    | ISystemLandscapeDiagram
    | ISystemContextDiagram
    | IContainerDiagram
    | IComponentDiagram
    | IDeploymentDiagram
    | IModelDiagram;
