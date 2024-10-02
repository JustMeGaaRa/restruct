import { describe, expect, test } from "vitest";
import { PersonBuilder, Tag } from "../../../src/models";

describe("Person Builder", () => {
    test("should build a person", () => {
        const builder = new PersonBuilder("Alice", "A person.");
        const person = builder.build();

        expect(person).toBeDefined();
        expect(person.name).toBe("Alice");
        expect(person.description).toBe("A person.");
        expect(person.identifier).toBeTruthy();
        expect(person.tags.some((x) => x.name === Tag.Element.name)).toBe(true);
        expect(person.tags.some((x) => x.name === Tag.Person.name)).toBe(true);
    });

    test("should have default person tag", () => {
        const builder = new PersonBuilder("Alice", "A person.");
        const person = builder.tags("Human", "Character").build();

        expect(person.tags).toBeDefined();
        expect(person.tags.length).toBe(4);
        expect(person.tags.some((x) => x.name === Tag.Element.name)).toBe(true);
        expect(person.tags.some((x) => x.name === Tag.Person.name)).toBe(true);
        expect(person.tags.some((x) => x.name === "Human")).toBe(true);
        expect(person.tags.some((x) => x.name === "Character")).toBe(true);
    });

    test("should add tags except default one", () => {
        const builder = new PersonBuilder("Alice", "A person.");
        const person = builder.tags("Person", "Character").build();

        expect(person.tags).toBeDefined();
        expect(person.tags.length).toBe(3);
        expect(person.tags.some((x) => x.name === Tag.Element.name)).toBe(true);
        expect(person.tags.some((x) => x.name === Tag.Person.name)).toBe(true);
        expect(person.tags.some((x) => x.name === "Character")).toBe(true);
    });
});
