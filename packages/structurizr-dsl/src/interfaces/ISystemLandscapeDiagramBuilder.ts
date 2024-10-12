import { IBuilder } from "../shared";
import { ISupportPrimaryElement } from "../shared/ISupportPrimaryElement";
import { ISupportRelationship } from "../shared/ISupportRelationship";
import { IGroup } from "./IGroup";
import { IPerson } from "./IPerson";
import { IRelationship } from "./IRelationship";
import { ISoftwareSystem } from "./ISoftwareSystem";
import { ISystemLandscapeDiagram } from "./ISystemLandscapeDiagram";

export interface ISystemLandscapeDiagramBuilder
    extends IBuilder<ISystemLandscapeDiagram>,
        ISupportPrimaryElement<IGroup | ISoftwareSystem | IPerson>,
        ISupportRelationship<IRelationship> {}
