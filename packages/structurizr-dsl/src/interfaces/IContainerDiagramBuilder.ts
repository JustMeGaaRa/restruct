import { IBuilder, ISupportScope, ISupportSupportingElement } from "../shared";
import { ISupportPrimaryElement } from "../shared/ISupportPrimaryElement";
import { ISupportRelationship } from "../shared/ISupportRelationship";
import { IContainer } from "./IContainer";
import { IContainerDiagram } from "./IContainerDiagram";
import { IGroup } from "./IGroup";
import { IPerson } from "./IPerson";
import { IRelationship } from "./IRelationship";
import { ISoftwareSystem } from "./ISoftwareSystem";

export interface IContainerDiagramBuilder
    extends IBuilder<IContainerDiagram>,
        ISupportScope<ISoftwareSystem>,
        ISupportPrimaryElement<IGroup | IContainer>,
        ISupportSupportingElement<ISoftwareSystem | IPerson>,
        ISupportRelationship<IRelationship> {}
