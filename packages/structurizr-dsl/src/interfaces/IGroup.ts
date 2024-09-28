import { Identifier } from "./Identifier";
import { ElementType } from "./ElementType";
import { ITag } from "./ITag";
import { IPerson } from "./IPerson";
import { ISoftwareSystem } from "./ISoftwareSystem";
import { IContainer } from "./IContainer";
import { IComponent } from "./IComponent";
import { IDeploymentEnvironment } from "./IDeploymentEnvironment";
import { IRelationship } from "./IRelationship";

export type IElement = IPerson | ISoftwareSystem | IContainer | IComponent;

export type IMember =
    | IElement
    | IGroup
    | IDeploymentEnvironment
    | IRelationship;

export interface IGroup {
    type: ElementType.Group;
    identifier: Identifier;
    name: string;
    tags: ITag[];
    people: IPerson[];
    softwareSystems: ISoftwareSystem[];
    containers: IContainer[];
    components: IComponent[];
}
