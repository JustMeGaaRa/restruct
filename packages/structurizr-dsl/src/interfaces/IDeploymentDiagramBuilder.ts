import {
    IBuilder,
    ISupportRelationship,
    ISupportScope,
    ISupportSupportingElement,
} from "../shared";
import { IContainer } from "./IContainer";
import { IContainerInstance } from "./IContainerInstance";
import { IDeploymentDiagram } from "./IDeploymentDiagram";
import { IDeploymentEnvironment } from "./IDeploymentEnvironment";
import { IDeploymentNode } from "./IDeploymentNode";
import { IInfrastructureNode } from "./IInfrastructureNode";
import { IRelationship } from "./IRelationship";
import { ISoftwareSystem } from "./ISoftwareSystem";
import { ISoftwareSystemInstance } from "./ISoftwareSystemInstance";

export interface IDeploymentDiagramBuilder
    extends IBuilder<IDeploymentDiagram>,
        ISupportScope<IDeploymentEnvironment>,
        ISupportSupportingElement<
            | IDeploymentNode
            | IInfrastructureNode
            | ISoftwareSystemInstance
            | IContainerInstance
            | ISoftwareSystem
            | IContainer
        >,
        ISupportRelationship<IRelationship> {}
