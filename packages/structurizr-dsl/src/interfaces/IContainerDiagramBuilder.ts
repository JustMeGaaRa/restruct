import { IBuilder, ISupportScope, ISupportSupportingElement } from "../shared";
import { ISupportRelationship } from "../shared/ISupportRelationship";
import { IContainerDiagram } from "./IContainerDiagram";
import { IPerson } from "./IPerson";
import { IRelationship } from "./IRelationship";
import { ISoftwareSystem } from "./ISoftwareSystem";

export interface IContainerDiagramBuilder
    extends IBuilder<IContainerDiagram>,
        ISupportScope<ISoftwareSystem>,
        ISupportSupportingElement<ISoftwareSystem | IPerson>,
        ISupportRelationship<IRelationship> {}
