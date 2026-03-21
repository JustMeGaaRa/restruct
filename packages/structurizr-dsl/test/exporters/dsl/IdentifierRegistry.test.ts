import { describe, beforeEach, expect, test } from "vitest";
import { IdentifierRegistry } from "../../../src/exporters/dsl/IdentifierRegistry";

describe("IdRegistry", () => {
    let registry: IdentifierRegistry;

    beforeEach(() => {
        registry = new IdentifierRegistry();
    });

    test("registers an id and resolves it by path", () => {
        const id = registry.register("Person:Alice", "Alice");
        expect(id).toBe("alice");
        expect(registry.resolve("Person:Alice")).toBe("alice");
    });

    test("returns the same id for a repeated registration of the same path", () => {
        const first = registry.register("Person:Alice", "Alice");
        const second = registry.register("Person:Alice", "Alice");
        expect(first).toBe(second);
    });

    test("deduplicates ids by appending _2 for a name collision", () => {
        const first = registry.register("SoftwareSystem:API", "API");
        const second = registry.register("SoftwareSystem:Other/API", "API");
        expect(first).toBe("aPI");
        expect(second).toBe("aPI_2");
    });

    test("continues incrementing for triple collision", () => {
        registry.register("path/a", "Database");
        registry.register("path/b", "Database");
        const third = registry.register("path/c", "Database");
        expect(third).toBe("database_3");
    });

    test("returns undefined for an unregistered path", () => {
        expect(registry.resolve("SoftwareSystem:Unknown")).toBeUndefined();
    });

    test("has() returns false before registration", () => {
        expect(registry.has("Person:Alice")).toBe(false);
    });

    test("has() returns true after registration", () => {
        registry.register("Person:Alice", "Alice");
        expect(registry.has("Person:Alice")).toBe(true);
    });
});
