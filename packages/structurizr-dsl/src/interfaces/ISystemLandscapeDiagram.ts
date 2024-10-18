import { IDiagram } from "./IDiagram";
import { IGroup } from "./IGroup";
import { IPerson } from "./IPerson";
import { ISoftwareSystem } from "./ISoftwareSystem";

export interface ISystemLandscapeDiagram
    extends IDiagram<
        "workspace",
        IGroup | ISoftwareSystem | IPerson,
        unknown
    > {}
