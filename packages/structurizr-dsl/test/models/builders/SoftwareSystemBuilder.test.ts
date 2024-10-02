import { describe, expect, test } from "vitest";
import { SoftwareSystemBuilder, Tag } from "../../../src/models";

describe("Software System Builder", () => {
    test("should build a software system", () => {
        const builder = new SoftwareSystemBuilder(
            "Software System",
            "A software system."
        );
        const softwareSystem = builder.build();

        expect(softwareSystem).toBeDefined();
        expect(softwareSystem.name).toBe("Software System");
        expect(softwareSystem.description).toBe("A software system.");
        expect(softwareSystem.identifier).toBeTruthy();
        expect(
            softwareSystem.tags.some((x) => x.name === Tag.Element.name)
        ).toBe(true);
        expect(
            softwareSystem.tags.some((x) => x.name === Tag.SoftwareSystem.name)
        ).toBe(true);
    });

    test("should have default software system tag", () => {
        const builder = new SoftwareSystemBuilder(
            "Software System",
            "A software system."
        );
        const softwareSystem = builder.tags("External", "SaaS").build();

        expect(softwareSystem.tags).toBeDefined();
        expect(softwareSystem.tags.length).toBe(4);
        expect(
            softwareSystem.tags.some((x) => x.name === Tag.Element.name)
        ).toBe(true);
        expect(
            softwareSystem.tags.some((x) => x.name === Tag.SoftwareSystem.name)
        ).toBe(true);
        expect(softwareSystem.tags.some((x) => x.name === "External")).toBe(
            true
        );
        expect(softwareSystem.tags.some((x) => x.name === "SaaS")).toBe(true);
    });

    test("should add tags except default one", () => {
        const builder = new SoftwareSystemBuilder(
            "Software System",
            "A software system."
        );
        const softwareSystem = builder.tags("Software System", "SaaS").build();

        expect(softwareSystem.tags).toBeDefined();
        expect(softwareSystem.tags.length).toBe(3);
        expect(
            softwareSystem.tags.some((x) => x.name === Tag.Element.name)
        ).toBe(true);
        expect(
            softwareSystem.tags.some((x) => x.name === Tag.SoftwareSystem.name)
        ).toBe(true);
        expect(softwareSystem.tags.some((x) => x.name === "SaaS")).toBe(true);
    });

    test("should add a group", () => {
        const builder = new SoftwareSystemBuilder("Software System");
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
        const builder = new SoftwareSystemBuilder("Software System");
        const container = builder.container("Container", "A container.");
        const softwareSystem = builder.build();

        expect(softwareSystem.containers).toBeDefined();
        expect(softwareSystem.containers.length).toBe(1);
        expect(softwareSystem.containers.at(0)?.name).toBe("Container");
        expect(softwareSystem.containers.at(0)?.identifier).toBe(
            container.identifier
        );
        expect(container).toBeDefined();
        expect(container.name).toBe("Container");
        expect(container.description).toBe("A container.");
        expect(container.identifier).toBeTruthy();
    });
});
