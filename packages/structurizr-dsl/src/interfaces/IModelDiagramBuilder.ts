import {
    IBuilder,
    ISupportRelationship,
    ISupportSupportingElement,
} from "../shared";
import { IComponent } from "./IComponent";
import { IContainer } from "./IContainer";
import { IElement } from "./IElement";
import { IModelDiagram } from "./IModelDiagram";
import { IPerson } from "./IPerson";
import { IRelationship } from "./IRelationship";
import { ISoftwareSystem } from "./ISoftwareSystem";

export interface IModelDiagramBuilder
    extends IBuilder<IModelDiagram>,
        ISupportSupportingElement<
            ISoftwareSystem | IContainer | IComponent | IPerson | IElement
        >,
        ISupportRelationship<IRelationship> {}
