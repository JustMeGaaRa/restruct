import { ElementType, IContainer, Identifier, Url } from "../interfaces";
import { ISupportSnapshot } from "../shared";
import { Component } from "./Component";
import { Group } from "./Group";
import { Relationship } from "./Relationship";
import { Tag } from "./Tag";
import { Technology } from "./Technology";
import { String } from "../utils/string";

type ContainerParams = Required<Pick<IContainer, "name">> &
    Partial<Omit<IContainer, "type" | "name">>;

export class Container implements ISupportSnapshot<IContainer> {
    constructor(params: ContainerParams) {
        this.type = ElementType.Container;
        this.identifier = params.identifier ?? crypto.randomUUID();
        this.name = params.name;
        this.groups = params.groups
            ? params.groups.map((g) => new Group(g))
            : [];
        this.components = params.components
            ? params.components.map((c) => new Component(c))
            : [];
        this.technology = params.technology
            ? params.technology.map((x) => new Technology(x))
            : [];
        this.description = params.description;
        this.url = params.url;
        // this.properties = params.properties;
        // this.perspectives = params.perspectives;
        this.relationships = params.relationships
            ? params.relationships.map((r) => new Relationship(r))
            : [];
        this.tags = [
            Tag.Element,
            Tag.Container,
            ...(params.tags
                ?.map((t) => new Tag(t.name))
                ?.filter(
                    (x) => !String.equalsIgnoreCase(x.name, Tag.Element.name)
                )
                ?.filter(
                    (x) => !String.equalsIgnoreCase(x.name, Tag.Container.name)
                ) ?? []),
        ];
    }

    public readonly type: ElementType.Container;
    public readonly identifier: Identifier;
    public readonly name: string;
    public readonly groups: Group[];
    public readonly components: Component[];
    public readonly technology: Technology[];
    public readonly description?: string;
    public readonly tags: Tag[];
    public readonly url?: Url;
    // public readonly properties?: Properties;
    // public readonly perspectives?: Perspectives;
    public readonly relationships: Relationship[];

    public toSnapshot(): IContainer {
        return {
            type: this.type,
            identifier: this.identifier,
            name: this.name,
            groups: this.groups.map((g) => g.toSnapshot()),
            components: this.components.map((c) => c.toSnapshot()),
            technology: this.technology.map((t) => t.name),
            description: this.description,
            tags: this.tags,
            url: this.url,
            // properties: this.properties,
            // perspectives: this.perspectives,
            relationships: this.relationships.map((r) => r.toSnapshot()),
        };
    }
}
