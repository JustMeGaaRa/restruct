import { IComponent } from "./IComponent";
import { IContainer } from "./IContainer";
import { IDiagram } from "./IDiagram";
import { IGroup } from "./IGroup";
import { IPerson } from "./IPerson";
import { ISoftwareSystem } from "./ISoftwareSystem";

export interface IComponentDiagram
    extends IDiagram<
        IContainer,
        IGroup | IComponent,
        ISoftwareSystem | IContainer | IPerson
    > {}
