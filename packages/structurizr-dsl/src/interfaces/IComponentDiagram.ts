import { IContainer } from "./IContainer";
import { IDiagram } from "./IDiagram";
import { IPerson } from "./IPerson";
import { ISoftwareSystem } from "./ISoftwareSystem";

export type IComponentDiagram = IDiagram<
    IContainer,
    ISoftwareSystem | IContainer | IPerson
>;
