import { describe, expect, test } from "vitest";
import { ComponentBuilder, Tag } from "../../../src/models";

describe("Component Builder", () => {
    test("should build a component", () => {
        const builder = new ComponentBuilder("Component", "A component.");
        const component = builder.build();

        expect(component).toBeDefined();
        expect(component.name).toBe("Component");
        expect(component.description).toBe("A component.");
        expect(component.identifier).toBeTruthy();
    });

    test("should have default container tag", () => {
        const builder = new ComponentBuilder("Component", "A component.");
        const component = builder.tags("External", "SaaS").build();

        expect(component.tags).toBeDefined();
        expect(component.tags.length).toBe(4);
        expect(component.tags.some((x) => x.name === Tag.Element.name)).toBe(
            true
        );
        expect(component.tags.some((x) => x.name === Tag.Component.name)).toBe(
            true
        );
        expect(component.tags.some((x) => x.name === "External")).toBe(true);
        expect(component.tags.some((x) => x.name === "SaaS")).toBe(true);
    });

    test("should add tags and skip default duplicates", () => {
        const builder = new ComponentBuilder("Component", "A component.");
        const component = builder.tags("Component", "SaaS").build();

        expect(component.tags).toBeDefined();
        expect(component.tags.length).toBe(3);
        expect(component.tags.some((x) => x.name === Tag.Element.name)).toBe(
            true
        );
        expect(component.tags.some((x) => x.name === Tag.Component.name)).toBe(
            true
        );
        expect(component.tags.some((x) => x.name === "SaaS")).toBe(true);
    });
});
