import { IContainer } from "./IContainer";
import { IDiagram } from "./IDiagram";
import { IPerson } from "./IPerson";
import { ISoftwareSystem } from "./ISoftwareSystem";

export interface IContainerDiagram
    extends IDiagram<ISoftwareSystem, IContainer, ISoftwareSystem | IPerson> {}
