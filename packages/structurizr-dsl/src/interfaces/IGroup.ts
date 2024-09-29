import { Identifier } from "./Identifier";
import { ElementType } from "./ElementType";
import { ITag } from "./ITag";
import { IPerson } from "./IPerson";
import { ISoftwareSystem } from "./ISoftwareSystem";
import { IContainer } from "./IContainer";
import { IComponent } from "./IComponent";

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
