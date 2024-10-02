import { IComponent } from "../../interfaces";
import { IBuilder } from "../../shared";
import { Component } from "../Component";

export class ComponentBuilder implements IBuilder<IComponent> {
    private component: IComponent;

    constructor(name: string, description?: string, tags?: string[]) {
        this.component = new Component({
            name,
            description,
            tags: tags?.map((tag) => ({ name: tag })) ?? [],
        }).toSnapshot();
    }

    tags(...tags: string[]): this {
        this.component.tags = tags.map((tag) => ({ name: tag }));
        return this;
    }

    build(): IComponent {
        return this.component;
    }
}
