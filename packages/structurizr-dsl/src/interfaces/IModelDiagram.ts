import { IDiagram } from "./IDiagram";
import { ISoftwareSystem } from "./ISoftwareSystem";
import { IContainer } from "./IContainer";
import { IComponent } from "./IComponent";
import { IPerson } from "./IPerson";

export type IModelDiagram = IDiagram<
    unknown,
    ISoftwareSystem | IContainer | IComponent | IPerson
>;
