import { describe, expect, test } from "vitest";
import { Identifier } from "../../src/interfaces";

describe("Identifier", () => {
    test("should create an identifier", () => {
        const identifier = Identifier.createOrDefault();

        expect(identifier).toBeDefined();
        expect(identifier.identifier).toBeTruthy();
    });

    test.each([
        ["identifier"],
        ["another-identifier"],
        ["yet-another-identifier"],
    ])("should create an identifier with a value", (value) => {
        const identifier = Identifier.createOrDefault(value);

        expect(identifier).toBeDefined();
        expect(identifier.identifier).toBe(value);
    });

    test("should parse an identifier", () => {
        const identifier = Identifier.parse("identifier");

        expect(identifier).toBeDefined();
        expect(identifier.identifier).toBe("identifier");
    });

    test("should throw an error when parsing an empty identifier", () => {
        expect(() => Identifier.parse("")).toThrow(
            "An identifier must be provided."
        );
    });
});
