import {
    IDeploymentEnvironment,
    IGroup,
    IModel,
    IPerson,
    IRelationship,
    ISoftwareSystem,
} from "../../interfaces";
import { BuilderCallback, IBuilder } from "../../shared";
import { Relationship } from "../Relationship";
import { DeploymentEnvironmentBuilder } from "./DeploymentEnvironmentBuilder";
import { GroupBuilder } from "./GroupBuilder";
import { PersonBuilder } from "./PersonBuilder";
import { SoftwareSystemBuilder } from "./SoftwareSystemBuilder";

export class ModelBuilder implements IBuilder<IModel> {
    private model: IModel;
    private elementLookup: Map<
        string,
        IGroup | IPerson | ISoftwareSystem | IDeploymentEnvironment
    >;

    constructor() {
        this.elementLookup = new Map();
        this.model = {
            groups: [],
            people: [],
            softwareSystems: [],
            deploymentEnvironments: [],
            relationships: [],
        };
    }

    group(name: string, callback: BuilderCallback<GroupBuilder>): IGroup {
        const groupBuilder = new GroupBuilder(name);
        callback(groupBuilder);
        const group = groupBuilder.build();
        this.model.groups.push(group);
        this.elementLookup.set(group.identifier, group);
        return group;
    }

    person(
        name: string,
        description?: string,
        callback?: BuilderCallback<PersonBuilder>
    ): IPerson {
        const personBuilder = new PersonBuilder(name, description);
        callback?.(personBuilder);
        const person = personBuilder.build();
        this.model.people.push(person);
        this.elementLookup.set(person.identifier, person);
        return person;
    }

    softwareSystem(
        name: string,
        description?: string,
        callback?: BuilderCallback<SoftwareSystemBuilder>
    ): ISoftwareSystem {
        const softwareSystemBuilder = new SoftwareSystemBuilder(
            name,
            description
        );
        callback?.(softwareSystemBuilder);
        const softareSystem = softwareSystemBuilder.build();
        this.model.softwareSystems.push(softareSystem);
        this.elementLookup.set(softareSystem.identifier, softareSystem);
        return softareSystem;
    }

    deploymentEnvironment(
        name: string,
        callback: BuilderCallback<DeploymentEnvironmentBuilder>
    ): IDeploymentEnvironment {
        const deploymentEnvironmentBuilder = new DeploymentEnvironmentBuilder(
            name
        );
        callback(deploymentEnvironmentBuilder);
        const deploymentEnvironment = deploymentEnvironmentBuilder.build();
        this.model.deploymentEnvironments.push(deploymentEnvironment);
        this.elementLookup.set(
            deploymentEnvironment.identifier,
            deploymentEnvironment
        );
        return deploymentEnvironment;
    }

    uses(source: string, target: string, description?: string): IRelationship {
        if (!this.elementLookup.has(source)) {
            throw new Error(`Element with identifier ${source} not found.`);
        }
        if (!this.elementLookup.has(target)) {
            throw new Error(`Element with identifier ${target} not found.`);
        }
        const relationship = new Relationship({
            sourceIdentifier: source,
            targetIdentifier: target,
            description,
        }).toSnapshot();
        this.model.relationships.push(relationship);
        return relationship;
    }

    build(): IModel {
        return this.model;
    }
}
