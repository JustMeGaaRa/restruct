import { IContainer } from "./IContainer";
import { IDiagram } from "./IDiagram";
import { IGroup } from "./IGroup";
import { IPerson } from "./IPerson";
import { ISoftwareSystem } from "./ISoftwareSystem";

export interface IContainerDiagram
    extends IDiagram<
        ISoftwareSystem,
        IGroup | IContainer,
        ISoftwareSystem | IPerson
    > {}
