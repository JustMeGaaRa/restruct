import { IContainer } from "./IContainer";
import { IContainerInstance } from "./IContainerInstance";
import { IDeploymentEnvironment } from "./IDeploymentEnvironment";
import { IDeploymentNode } from "./IDeploymentNode";
import { IDiagram } from "./IDiagram";
import { IInfrastructureNode } from "./IInfrastructureNode";
import { ISoftwareSystem } from "./ISoftwareSystem";
import { ISoftwareSystemInstance } from "./ISoftwareSystemInstance";

export type IDeploymentDiagram = IDiagram<
    IDeploymentEnvironment,
    | IDeploymentNode
    | IInfrastructureNode
    | ISoftwareSystemInstance
    | IContainerInstance
    | ISoftwareSystem
    | IContainer
>;
