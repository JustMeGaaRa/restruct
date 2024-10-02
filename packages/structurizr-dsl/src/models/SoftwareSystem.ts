import { ElementType, ISoftwareSystem, Identifier, Url } from "../interfaces";
import { ISupportSnapshot } from "../shared";
import { Container } from "./Container";
import { Group } from "./Group";
import { Relationship } from "./Relationship";
import { Tag } from "./Tag";
import { String } from "../utils/string";

export type SoftwareSystemParams = Required<
    Pick<ISoftwareSystem, "name" | "identifier">
> &
    Partial<Omit<ISoftwareSystem, "type" | "name" | "identifier">>;

export class SoftwareSystem implements ISupportSnapshot<ISoftwareSystem> {
    constructor(params: SoftwareSystemParams) {
        this.type = ElementType.SoftwareSystem;
        this.identifier = params.identifier;
        this.name = params.name;
        this.groups = params.groups
            ? params.groups.map((g) => new Group(g))
            : [];
        this.containers = params.containers
            ? params.containers.map((c) => new Container(c))
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
            Tag.SoftwareSystem,
            ...(params.tags
                ?.map((t) => new Tag(t.name))
                ?.filter(
                    (x) => !String.equalsIgnoreCase(x.name, Tag.Element.name)
                )
                ?.filter(
                    (x) =>
                        !String.equalsIgnoreCase(
                            x.name,
                            Tag.SoftwareSystem.name
                        )
                ) ?? []),
        ];
    }

    public readonly type: ElementType.SoftwareSystem;
    public readonly identifier: Identifier;
    public readonly name: string;
    public readonly groups: Group[];
    public readonly containers: Container[];
    public readonly description?: string;
    public readonly tags: Tag[];
    public readonly url?: Url;
    // public readonly properties?: Properties;
    // public readonly perspectives?: Perspectives;
    public readonly relationships: Relationship[];

    public toSnapshot(): ISoftwareSystem {
        return {
            type: this.type,
            identifier: this.identifier,
            name: this.name,
            groups: this.groups.map((g) => g.toSnapshot()),
            containers: this.containers.map((c) => c.toSnapshot()),
            description: this.description,
            tags: this.tags,
            url: this.url,
            // properties: this.properties,
            // perspectives: this.perspectives,
            relationships: this.relationships.map((r) => r.toSnapshot()),
        };
    }
}
