import { IDiagram } from "./IDiagram";
import { IPerson } from "./IPerson";
import { ISoftwareSystem } from "./ISoftwareSystem";

export interface ISystemLandscapeDiagram
    extends IDiagram<"workspace", ISoftwareSystem | IPerson, unknown> {}
