import { describe, expect, test } from "vitest";
import { RelationshipBuilder, Tag } from "../../../src/models";

describe("Relationship Builder", () => {
    test("should build a relationship", () => {
        const builder = new RelationshipBuilder("Source", "Target");
        const relationship = builder.build();

        expect(relationship).toBeDefined();
        expect(relationship.sourceIdentifier).toBe("Source");
        expect(relationship.targetIdentifier).toBe("Target");
    });

    test("should add technology", () => {
        const builder = new RelationshipBuilder("Source", "Target");
        const relationship = builder.technology("Technology").build();

        expect(relationship.technology).toBeDefined();
        expect(relationship.technology).toHaveLength(1);
        expect(relationship.technology?.[0]).toBe("Technology");
    });

    test("should add multiple technologies", () => {
        const builder = new RelationshipBuilder("Source", "Target");
        const relationship = builder
            .technology("Technology1", "Technology2")
            .build();

        expect(relationship.technology).toBeDefined();
        expect(relationship.technology).toHaveLength(2);
        expect(relationship.technology?.[0]).toBe("Technology1");
        expect(relationship.technology?.[1]).toBe("Technology2");
    });

    test("should add tags", () => {
        const builder = new RelationshipBuilder("Source", "Target");
        const relationship = builder.tags("Tag1", "Tag2").build();

        expect(relationship.tags).toBeDefined();
        expect(relationship.tags).toHaveLength(3);
        expect(relationship.tags?.[0]?.name).toBe(Tag.Relationship.name);
        expect(relationship.tags?.[1]?.name).toBe("Tag1");
        expect(relationship.tags?.[2]?.name).toBe("Tag2");
    });
});
