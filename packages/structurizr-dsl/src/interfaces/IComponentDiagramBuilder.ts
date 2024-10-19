import { IBuilder, ISupportScope, ISupportSupportingElement } from "../shared";
import { ISupportRelationship } from "../shared/ISupportRelationship";
import { IComponentDiagram } from "./IComponentDiagram";
import { IContainer } from "./IContainer";
import { IPerson } from "./IPerson";
import { IRelationship } from "./IRelationship";
import { ISoftwareSystem } from "./ISoftwareSystem";

export interface IComponentDiagramBuilder
    extends IBuilder<IComponentDiagram>,
        ISupportScope<IContainer>,
        ISupportSupportingElement<ISoftwareSystem | IContainer | IPerson>,
        ISupportRelationship<IRelationship> {}
