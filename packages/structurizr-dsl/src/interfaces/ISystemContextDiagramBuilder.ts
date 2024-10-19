import { IBuilder, ISupportScope, ISupportSupportingElement } from "../shared";
import { ISupportRelationship } from "../shared/ISupportRelationship";
import { IPerson } from "./IPerson";
import { IRelationship } from "./IRelationship";
import { ISoftwareSystem } from "./ISoftwareSystem";
import { ISystemContextDiagram } from "./ISystemContextDiagram";

export interface ISystemContextDiagramBuilder
    extends IBuilder<ISystemContextDiagram>,
        ISupportScope<ISoftwareSystem>,
        ISupportSupportingElement<ISoftwareSystem | IPerson>,
        ISupportRelationship<IRelationship> {}
