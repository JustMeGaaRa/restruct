import { IContainer, ISoftwareSystem } from "../../interfaces";
import { BuilderCallback, IBuilder } from "../../shared";
import { SoftwareSystem } from "../SoftwareSystem";
import { ContainerBuilder } from "./ContainerBuilder";

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
