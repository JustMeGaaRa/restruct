import { IComponent } from "../interfaces/IComponent";
import { IContainer } from "../interfaces/IContainer";
import { IContainerInstance } from "../interfaces/IContainerInstance";
import { IDeploymentNode } from "../interfaces/IDeploymentNode";
import { IGroup } from "../interfaces/IGroup";
import { IInfrastructureNode } from "../interfaces/IInfrastructureNode";
import { IPerson } from "../interfaces/IPerson";
import { IRelationship } from "../interfaces/IRelationship";
import { ISoftwareSystem } from "../interfaces/ISoftwareSystem";
import { ISoftwareSystemInstance } from "../interfaces/ISoftwareSystemInstance";
import { IWorkspace } from "../interfaces/IWorkspace";

export interface IElementVisitor<T = unknown> {
    visitWorkspace?: (
        workspace: IWorkspace,
        params?: { children?: Array<T> }
    ) => T;
    visitGroup?: (
        group: IGroup,
        params?: { parentId?: string; children?: Array<T> }
    ) => T;
    visitPerson?: (
        person: IPerson,
        params?: { parentId?: string; children?: Array<T> }
    ) => T;
    visitSoftwareSystem?: (
        softwareSystem: ISoftwareSystem,
        params?: { parentId?: string; children?: Array<T> }
    ) => T;
    visitContainer?: (
        container: IContainer,
        params?: { parentId?: string; children?: Array<T> }
    ) => T;
    visitComponent?: (
        component: IComponent,

        params?: { parentId?: string; children?: Array<T> }
    ) => T;
    visitDeploymentNode?: (
        deploymentNode: IDeploymentNode,
        params?: { parentId?: string; children?: Array<T> }
    ) => T;
    visitInfrastructureNode?: (
        infrastructureNode: IInfrastructureNode,
        params?: { parentId?: string; children?: Array<T> }
    ) => T;
    visitSoftwareSystemInstance?: (
        softwareSystemInstance: ISoftwareSystemInstance,
        params?: { parentId?: string; children?: Array<T> }
    ) => T;
    visitContainerInstance?: (
        containerInstance: IContainerInstance,
        params?: { parentId?: string; children?: Array<T> }
    ) => T;
    visitRelationship?: (
        relationship: IRelationship,
        params?: { children?: Array<T> }
    ) => T;
}
