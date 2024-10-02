import { IDiagram } from "./IDiagram";
import { IPerson } from "./IPerson";
import { ISoftwareSystem } from "./ISoftwareSystem";

export interface ISystemContextDiagram
    extends IDiagram<unknown, ISoftwareSystem, ISoftwareSystem | IPerson> {}
