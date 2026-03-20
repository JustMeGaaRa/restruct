import { IComponent } from "../../interfaces";
import { IBuilder } from "../../shared";
import { Component } from "../Component";

export class ComponentBuilder implements IBuilder<IComponent> {
    private component: IComponent;

    private idPath: string;

    constructor(name: string, description?: string, tags?: string[], parentPath: string = "") {
        this.idPath = parentPath ? `${parentPath}/Component:${name}` : `Component:${name}`;
        this.component = new Component({
            identifier: this.idPath,
            name,
            description,
            tags: tags?.map((tag) => ({ name: tag })) ?? [],
        }).toSnapshot();
    }

    tags(...tags: string[]): this {
        this.component = new Component({
            ...this.component,
            tags: tags.map((tag) => ({ name: tag })),
        }).toSnapshot();
        return this;
    }

    build(): IComponent {
        return this.component;
    }
}
