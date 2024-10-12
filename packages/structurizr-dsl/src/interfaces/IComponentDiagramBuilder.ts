import { IBuilder, ISupportScope, ISupportSupportingElement } from "../shared";
import { ISupportPrimaryElement } from "../shared/ISupportPrimaryElement";
import { ISupportRelationship } from "../shared/ISupportRelationship";
import { IComponent } from "./IComponent";
import { IComponentDiagram } from "./IComponentDiagram";
import { IContainer } from "./IContainer";
import { IGroup } from "./IGroup";
import { IPerson } from "./IPerson";
import { IRelationship } from "./IRelationship";
import { ISoftwareSystem } from "./ISoftwareSystem";

export interface IComponentDiagramBuilder
    extends IBuilder<IComponentDiagram>,
        ISupportScope<IContainer>,
        ISupportPrimaryElement<IGroup | IComponent>,
        ISupportSupportingElement<ISoftwareSystem | IContainer | IPerson>,
        ISupportRelationship<IRelationship> {}
