import { describe, expect, test } from "vitest";
import { GroupBuilder, Tag } from "../../../src/models";

describe("Group Builder", () => {
    test("should build a group with specified identifier, name and tags", () => {
        const builder = new GroupBuilder("Big Bank plc.");
        const group = builder.build();

        expect(group).toBeDefined();
        expect(group.name).toBe("Big Bank plc.");
        expect(group.identifier).toBeTruthy();
        expect(group.type).toBe("Group");
        expect(group.tags).toBeDefined();
        expect(group.tags.length).toBe(2);
        expect(group.tags.some((tag) => tag.name === Tag.Element.name)).toBe(
            true
        );
        expect(group.tags.some((tag) => tag.name === Tag.Group.name)).toBe(
            true
        );
    });

    test("should add 2 persons to a group", () => {
        const builder = new GroupBuilder("Big Bank plc.");
        const alice = builder.person("Alice", "A person.");
        const bob = builder.person("Bob", "Another person.");
        const group = builder.build();

        expect(group).toBeDefined();
        expect(group.people).toBeDefined();
        expect(group.people.length).toBe(2);
        expect(group.people.some((person) => person.name === "Alice")).toBe(
            true
        );
        expect(group.people.some((person) => person.name === "Bob")).toBe(true);
        expect(alice).toBeDefined();
        expect(alice.name).toBe("Alice");
        expect(bob).toBeDefined();
        expect(bob.name).toBe("Bob");
    });

    test("should add a software system to a group", () => {
        const builder = new GroupBuilder("Big Bank plc.");
        const softwareSystem = builder.softwareSystem("Software System");
        const group = builder.build();

        expect(group).toBeDefined();
        expect(group.softwareSystems).toBeDefined();
        expect(group.softwareSystems.length).toBe(1);
        expect(group.softwareSystems.at(0)?.name).toBe("Software System");
        expect(softwareSystem).toBeDefined();
        expect(softwareSystem.name).toBe("Software System");
    });

    test("should add a container to a group", () => {
        const builder = new GroupBuilder("Big Bank plc.");
        const container = builder.container("Container");
        const group = builder.build();

        expect(group).toBeDefined();
        expect(group.containers).toBeDefined();
        expect(group.containers.length).toBe(1);
        expect(group.containers.at(0)?.name).toBe("Container");
        expect(container).toBeDefined();
        expect(container.name).toBe("Container");
    });

    test("should add a component to a group", () => {
        const builder = new GroupBuilder("Big Bank plc.");
        const component = builder.component("Component");
        const group = builder.build();

        expect(group).toBeDefined();
        expect(group.components).toBeDefined();
        expect(group.components.length).toBe(1);
        expect(group.components.at(0)?.name).toBe("Component");
        expect(component).toBeDefined();
        expect(component.name).toBe("Component");
    });
});
