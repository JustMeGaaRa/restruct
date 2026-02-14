import { IDiagram } from "./IDiagram";
import { IPerson } from "./IPerson";
import { ISoftwareSystem } from "./ISoftwareSystem";

export type ISystemContextDiagram = IDiagram<
    ISoftwareSystem,
    ISoftwareSystem | IPerson
>;
