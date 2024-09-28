import { IGroup } from "./IGroup";
import { IRelationship } from "./IRelationship";
import { IDeploymentEnvironment } from "./IDeploymentEnvironment";
import { ISoftwareSystem } from "./ISoftwareSystem";
import { IPerson } from "./IPerson";

export interface IModel {
    people: IPerson[];
    softwareSystems: ISoftwareSystem[];
    deploymentEnvironments: IDeploymentEnvironment[];
    relationships: IRelationship[];
    groups: IGroup[];
}
