import { IContainerInstance } from "./IContainerInstance";
import { IDeploymentNode } from "./IDeploymentNode";
import { IDiagram } from "./IDiagram";
import { IInfrastructureNode } from "./IInfrastructureNode";
import { ISoftwareSystem } from "./ISoftwareSystem";
import { ISoftwareSystemInstance } from "./ISoftwareSystemInstance";

export type IDeploymentDiagram = IDiagram<
    ISoftwareSystem,
    | IDeploymentNode
    | ISoftwareSystemInstance
    | IContainerInstance
    | IInfrastructureNode
>;
