import { ElementType, IGroup, Identifier } from "../interfaces";
import { ISupportSnapshot } from "../shared";
import { Component } from "./Component";
import { Container } from "./Container";
import { Person } from "./Person";
import { SoftwareSystem } from "./SoftwareSystem";
import { Tag } from "./Tag";

type GroupParams = Required<Pick<IGroup, "name">> &
    Partial<Omit<IGroup, "type" | "name">>;

export class Group implements ISupportSnapshot<IGroup> {
    constructor(params: GroupParams) {
        this.type = ElementType.Group;
        this.identifier = params.identifier ?? crypto.randomUUID();
        this.name = params.name;
        this.people = params.people
            ? params.people.map((p) => new Person(p))
            : [];
        this.softwareSystems = params.softwareSystems
            ? params.softwareSystems.map((s) => new SoftwareSystem(s))
            : [];
        this.containers = params.containers
            ? params.containers.map((c) => new Container(c))
            : [];
        this.components = params.components
            ? params.components.map((c) => new Component(c))
            : [];
        this.tags = [
            Tag.Element,
            Tag.Group,
            ...(params.tags
                ?.map((t) => new Tag(t.name))
                ?.filter((x) => x.name !== Tag.Element.name)
                ?.filter((x) => x.name !== Tag.Group.name) ?? []),
        ];
    }

    public readonly type: ElementType.Group;
    public readonly identifier: Identifier;
    public readonly name: string;
    public readonly tags: Tag[];
    public readonly people: Array<Person>;
    public readonly softwareSystems: Array<SoftwareSystem>;
    public readonly containers: Array<Container>;
    public readonly components: Array<Component>;

    public toSnapshot(): IGroup {
        return {
            type: this.type,
            identifier: this.identifier,
            name: this.name,
            tags: this.tags,
            people: this.people.map((p) => p.toSnapshot()),
            softwareSystems: this.softwareSystems.map((s) => s.toSnapshot()),
            containers: this.containers.map((c) => c.toSnapshot()),
            components: this.components.map((c) => c.toSnapshot()),
        };
    }
}
