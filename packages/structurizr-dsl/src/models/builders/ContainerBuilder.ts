import { IComponent, IContainer } from "../../interfaces";
import { BuilderCallback, IBuilder } from "../../shared";
import { Container } from "../Container";
import { ComponentBuilder } from "./ComponentBuilder";

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
