import { IDiagram } from "./IDiagram";
import { IPerson } from "./IPerson";
import { ISoftwareSystem } from "./ISoftwareSystem";

export type IContainerDiagram = IDiagram<
    ISoftwareSystem,
    ISoftwareSystem | IPerson
>;
