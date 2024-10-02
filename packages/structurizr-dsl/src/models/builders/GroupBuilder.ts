import {
    IComponent,
    IContainer,
    IGroup,
    IPerson,
    ISoftwareSystem,
} from "../../interfaces";
import { BuilderCallback, IBuilder } from "../../shared";
import { Group } from "../Group";
import { ComponentBuilder } from "./ComponentBuilder";
import { ContainerBuilder } from "./ContainerBuilder";
import { PersonBuilder } from "./PersonBuilder";
import { SoftwareSystemBuilder } from "./SoftwareSystemBuilder";

export class GroupBuilder implements IBuilder<IGroup> {
    private group: IGroup;

    constructor(name: string) {
        this.group = new Group({
            name,
            people: [],
            softwareSystems: [],
            containers: [],
            components: [],
        }).toSnapshot();
    }

    person(
        name: string,
        description?: string,
        callback?: BuilderCallback<PersonBuilder>
    ): IPerson {
        const personBuilder = new PersonBuilder(name, description);
        callback?.(personBuilder);
        const person = personBuilder.build();
        this.group.people.push(person);
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
        this.group.softwareSystems.push(softareSystem);
        return softareSystem;
    }

    container(
        name: string,
        description?: string,
        callback?: BuilderCallback<ContainerBuilder>
    ): IContainer {
        const containerBuilder = new ContainerBuilder(name, description);
        callback?.(containerBuilder);
        const container = containerBuilder.build();
        this.group.containers.push(container);
        return container;
    }

    component(
        name: string,
        description?: string,
        tags?: string[],
        callback?: BuilderCallback<ComponentBuilder>
    ): IComponent {
        const componentBuilder = new ComponentBuilder(name, description, tags);
        callback?.(componentBuilder);
        const component = componentBuilder.build();
        this.group.components.push(component);
        return component;
    }

    build(): IGroup {
        return this.group;
    }
}
