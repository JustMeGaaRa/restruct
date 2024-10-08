import { ElementType, IPerson, Identifier, Url } from "../interfaces";
import { ISupportSnapshot } from "../shared";
import { Relationship } from "./Relationship";
import { Tag } from "./Tag";
import { String } from "../utils/string";

type PersonParams = Required<Pick<IPerson, "name">> &
    Partial<Omit<IPerson, "type" | "name">>;

export class Person implements ISupportSnapshot<IPerson> {
    constructor(params: PersonParams) {
        this.type = ElementType.Person;
        this.identifier = Identifier.createOrDefault(params.identifier);
        this.name = params.name;
        this.description = params.description;
        this.url = params.url;
        // this.properties = params.properties;
        // this.perspectives = params.perspectives;
        this.relationships = params.relationships
            ? params.relationships.map((r) => new Relationship(r))
            : [];
        this.tags = [
            Tag.Element,
            Tag.Person,
            ...(params.tags
                ?.map((t) => new Tag(t.name))
                ?.filter(
                    (x) => !String.equalsIgnoreCase(x.name, Tag.Element.name)
                )
                ?.filter(
                    (x) => !String.equalsIgnoreCase(x.name, Tag.Person.name)
                ) ?? []),
        ];
    }

    public readonly type: ElementType.Person;
    public readonly identifier: Identifier;
    public readonly name: string;
    public readonly tags: Tag[];
    public readonly description?: string;
    public readonly url?: Url;
    // public readonly properties?: Properties;
    // public readonly perspectives?: Perspectives;
    public readonly relationships: Relationship[];

    public toSnapshot(): IPerson {
        return {
            type: this.type,
            identifier: this.identifier.toString(),
            name: this.name,
            tags: this.tags,
            description: this.description,
            url: this.url,
            // properties: this.properties,
            // perspectives: this.perspectives,
            relationships: this.relationships.map((r) => r.toSnapshot()),
        };
    }
}
