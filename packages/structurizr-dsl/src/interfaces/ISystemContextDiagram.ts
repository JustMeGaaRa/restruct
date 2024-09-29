import { IComponent } from "./IComponent";
import { IContainer } from "./IContainer";
import { IContainerInstance } from "./IContainerInstance";
import { IDeploymentNode } from "./IDeploymentNode";
import { IInfrastructureNode } from "./IInfrastructureNode";
import { IPerson } from "./IPerson";
import { IRelationship } from "./IRelationship";
import { ISoftwareSystem } from "./ISoftwareSystem";
import { ISoftwareSystemInstance } from "./ISoftwareSystemInstance";

export interface IDiagram<TScope, TPrimary, TSupporting> {
    scope: TScope;
    primaryElements: Array<TPrimary>;
    supportingElements: Array<TSupporting>;
    relationships: Array<IRelationship>;
}

export interface ISystemLandscapeDiagram
    extends IDiagram<"all", ISoftwareSystem, "none"> {}

export interface ISystemContextDiagram
    extends IDiagram<ISoftwareSystem, ISoftwareSystem, IPerson> {}

export interface IContainerDiagram
    extends IDiagram<ISoftwareSystem, IContainer, ISoftwareSystem | IPerson> {}

export interface IComponentDiagram
    extends IDiagram<
        IContainer,
        IComponent,
        ISoftwareSystem | IComponent | IPerson
    > {}

export interface IDeploymentDiagram
    extends IDiagram<
        ISoftwareSystem,
        IDeploymentNode | ISoftwareSystemInstance | IContainerInstance,
        IInfrastructureNode
    > {}
