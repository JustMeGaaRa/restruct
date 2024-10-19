import { IDiagram } from "./IDiagram";
import { IPerson } from "./IPerson";
import { ISoftwareSystem } from "./ISoftwareSystem";

export interface IContainerDiagram
    extends IDiagram<ISoftwareSystem, ISoftwareSystem | IPerson> {}
