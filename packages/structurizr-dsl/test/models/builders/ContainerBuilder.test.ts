import { describe, expect, test } from "vitest";
import { ContainerBuilder, Tag } from "../../../src/models";

describe("Container Builder", () => {
    test("should build a container", () => {
        const builder = new ContainerBuilder("Container", "A container.");
        const container = builder.build();

        expect(container).toBeDefined();
        expect(container.name).toBe("Container");
        expect(container.description).toBe("A container.");
        expect(container.identifier).toBeTruthy();
        expect(container.tags.some((x) => x.name === Tag.Element.name)).toBe(
            true
        );
        expect(container.tags.some((x) => x.name === Tag.Container.name)).toBe(
            true
        );
    });

    test("should have default container tag", () => {
        const builder = new ContainerBuilder("Container", "A container.");
        const container = builder.tags("External", "SaaS").build();

        expect(container.tags).toBeDefined();
        expect(container.tags.length).toBe(4);
        expect(container.tags.some((x) => x.name === Tag.Element.name)).toBe(
            true
        );
        expect(container.tags.some((x) => x.name === Tag.Container.name)).toBe(
            true
        );
        expect(container.tags.some((x) => x.name === "External")).toBe(true);
        expect(container.tags.some((x) => x.name === "SaaS")).toBe(true);
    });

    test("should add tags and skip default duplicates", () => {
        const builder = new ContainerBuilder("Container", "A container.");
        const container = builder.tags("Container", "SaaS").build();

        expect(container.tags).toBeDefined();
        expect(container.tags.length).toBe(3);
        expect(container.tags.some((x) => x.name === Tag.Element.name)).toBe(
            true
        );
        expect(container.tags.some((x) => x.name === Tag.Container.name)).toBe(
            true
        );
        expect(container.tags.some((x) => x.name === "SaaS")).toBe(true);
    });

    test("should add a group", () => {
        const builder = new ContainerBuilder("Container", "A container.");
        const group = builder.group("Group", () => {});
        const softwareSystem = builder.build();

        expect(softwareSystem.groups).toBeDefined();
        expect(softwareSystem.groups.length).toBe(1);
        expect(softwareSystem.groups.at(0)?.name).toBe("Group");
        expect(softwareSystem.groups.at(0)?.identifier).toBe(group.identifier);
        expect(group).toBeDefined();
        expect(group.name).toBe("Group");
        expect(group.identifier).toBeTruthy();
    });

    test("should add a container", () => {
        const builder = new ContainerBuilder("Container", "A container.");
        const component = builder.component("Component", "A component.");
        const container = builder.build();

        expect(container.components).toBeDefined();
        expect(container.components.length).toBe(1);
        expect(container.components.at(0)?.name).toBe("Component");
        expect(container.components.at(0)?.identifier).toBe(
            component.identifier
        );
        expect(component).toBeDefined();
        expect(component.name).toBe("Component");
        expect(component.description).toBe("A component.");
        expect(component.identifier).toBeTruthy();
    });
});
