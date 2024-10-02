import { IContainer, IGroup, ISoftwareSystem } from "../../interfaces";
import { BuilderCallback, IBuilder } from "../../shared";
import { SoftwareSystem } from "../SoftwareSystem";
import { ContainerBuilder } from "./ContainerBuilder";
import { GroupBuilder } from "./GroupBuilder";

export class SoftwareSystemBuilder implements IBuilder<ISoftwareSystem> {
    private softwareSystem: ISoftwareSystem;

    constructor(name: string, description?: string) {
        this.softwareSystem = new SoftwareSystem({
            // TODO: generate an identifier
            identifier: "",
            name,
            description,
            groups: [],
            containers: [],
        }).toSnapshot();
    }

    tags(...tags: string[]): this {
        this.softwareSystem = new SoftwareSystem({
            ...this.softwareSystem,
            tags: tags.map((tag) => ({ name: tag })),
        }).toSnapshot();
        return this;
    }

    group(name: string, callback: BuilderCallback<GroupBuilder>): IGroup {
        const groupBuilder = new GroupBuilder(name);
        callback(groupBuilder);
        const group = groupBuilder.build();
        this.softwareSystem.groups.push(group);
        return group;
    }

    container(
        name: string,
        description?: string,
        callback?: BuilderCallback<ContainerBuilder>
    ): IContainer {
        const containerBuilder = new ContainerBuilder(name, description);
        callback?.(containerBuilder);
        const container = containerBuilder.build();
        this.softwareSystem.containers.push(container);
        return container;
    }

    build(): ISoftwareSystem {
        return this.softwareSystem;
    }
}
