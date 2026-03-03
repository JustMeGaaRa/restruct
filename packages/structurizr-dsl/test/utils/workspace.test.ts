import { describe, expect, test } from "vitest";
import { createImpliedRelationshipsDummy } from "../workspace";
import { createWorkspaceExplorer } from "../../src";

describe("getWorkspaceRelationships", () => {
    test("should have 1 relationship", () => {
        const workspace = createImpliedRelationshipsDummy();
        const { getWorkspaceRelationships } = createWorkspaceExplorer(
            workspace.model
        );
        const relationships = getWorkspaceRelationships();

        expect(relationships).toBeDefined();
        expect(relationships.length).toBe(1);
    });
});
