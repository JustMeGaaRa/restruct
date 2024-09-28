import { ElementType, IComponent, Identifier, Url } from "../interfaces";
import { ISupportSnapshot } from "../shared";
import { Relationship } from "./Relationship";
import { Tag } from "./Tag";
import { Technology } from "./Technology";

type ComponentParams = Required<Pick<IComponent, "name" | "identifier">> &
    Partial<Omit<IComponent, "type" | "name" | "identifier">>;

export class Component implements ISupportSnapshot<IComponent> {
    constructor(params: ComponentParams) {
        this.type = ElementType.Component;
        this.identifier = params.identifier;
        this.name = params.name;
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
            Tag.Component,
            ...(params.tags
                ?.filter((x) => x.name !== Tag.Element.name)
                ?.filter((x) => x.name !== Tag.Component.name) ?? []),
        ];
    }

    public readonly type: ElementType.Component;
    public readonly identifier: Identifier;
    public readonly name: string;
    public readonly technology: Technology[];
    public readonly description?: string;
    public readonly tags: Tag[];
    public readonly url?: Url;
    // public readonly properties?: Properties;
    // public readonly perspectives?: Perspectives;
    public readonly relationships: Relationship[];

    public toSnapshot(): IComponent {
        return {
            type: this.type,
            identifier: this.identifier,
            name: this.name,
            technology: this.technology.map((x) => x.name),
            description: this.description,
            tags: this.tags,
            url: this.url,
            // properties: this.properties,
            // perspectives: this.perspectives,
            relationships: this.relationships.map((r) => r.toSnapshot()),
        };
    }
}
