import { IBuilder, ISupportScope } from "../shared";
import { ISupportRelationship } from "../shared/ISupportRelationship";
import { IModel } from "./IModel";
import { IRelationship } from "./IRelationship";
import { ISystemLandscapeDiagram } from "./ISystemLandscapeDiagram";

export interface ISystemLandscapeDiagramBuilder
    extends IBuilder<ISystemLandscapeDiagram>,
        ISupportScope<IModel>,
        ISupportRelationship<IRelationship> {}
