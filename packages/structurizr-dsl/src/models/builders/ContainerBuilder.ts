import { IComponent, IContainer, IGroup } from "../../interfaces";
import { BuilderCallback, IBuilder } from "../../shared";
import { Container } from "../Container";
import { ComponentBuilder } from "./ComponentBuilder";
import { GroupBuilder } from "./GroupBuilder";

export class ContainerBuilder implements IBuilder<IContainer> {
    private container: IContainer;

    constructor(name: string, description?: string) {
        this.container = new Container({
            name,
            description,
            groups: [],
            components: [],
        }).toSnapshot();
    }

    tags(...tags: string[]): this {
        this.container = new Container({
            ...this.container,
            tags: tags.map((tag) => ({ name: tag })),
        }).toSnapshot();
        return this;
    }

    group(name: string, callback: BuilderCallback<GroupBuilder>): IGroup {
        const groupBuilder = new GroupBuilder(name);
        callback(groupBuilder);
        const group = groupBuilder.build();
        this.container.groups.push(group);
        return group;
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
        this.container.components.push(component);
        return component;
    }

    build(): IContainer {
        return this.container;
    }
}
