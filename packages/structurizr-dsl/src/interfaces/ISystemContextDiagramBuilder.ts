import { IBuilder, ISupportScope } from "../shared";
import { ISupportPrimaryElement } from "../shared/ISupportPrimaryElement";
import { ISupportRelationship } from "../shared/ISupportRelationship";
import { IPerson } from "./IPerson";
import { IRelationship } from "./IRelationship";
import { ISoftwareSystem } from "./ISoftwareSystem";
import { ISystemContextDiagram } from "./ISystemContextDiagram";

export interface ISystemContextDiagramBuilder
    extends IBuilder<ISystemContextDiagram>,
        ISupportScope<ISoftwareSystem>,
        ISupportPrimaryElement<ISoftwareSystem | IPerson>,
        ISupportRelationship<IRelationship> {}
