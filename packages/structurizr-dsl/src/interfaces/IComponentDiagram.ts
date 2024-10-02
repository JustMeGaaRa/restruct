import { IComponent } from "./IComponent";
import { IContainer } from "./IContainer";
import { IDiagram } from "./IDiagram";
import { IPerson } from "./IPerson";
import { ISoftwareSystem } from "./ISoftwareSystem";

export interface IComponentDiagram
    extends IDiagram<
        IContainer,
        IComponent,
        ISoftwareSystem | IContainer | IPerson
    > {}
