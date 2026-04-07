import { describe, expect, test } from "vitest";
import { createImpliedRelationshipsDummy } from "../workspace";
import { createDefaultWorkspace, createWorkspaceExplorer } from "../../src";

describe("createDefaultWorkspace", () => {
    test("should create default views for a workspace", () => {
        const workspace = createDefaultWorkspace();

        expect(workspace.views.systemLandscape).toBeDefined();
        expect(workspace.views.systemContexts.length).toBe(0);
        expect(workspace.views.systemContexts).toBeDefined();
        expect(workspace.views.containers.length).toBe(0);
        expect(workspace.views.containers).toBeDefined();
        expect(workspace.views.components.length).toBe(0);
        expect(workspace.views.components).toBeDefined();
        expect(workspace.views.deployments.length).toBe(0);
        expect(workspace.views.deployments).toBeDefined();
    });
});

describe("getWorkspaceRelationships", () => {
    test("should have 1 relationship", () => {
        const workspace = createImpliedRelationshipsDummy();
        const { getWorkspaceRelationships } =
            createWorkspaceExplorer(workspace);
        const relationships = getWorkspaceRelationships();

        expect(relationships).toBeDefined();
        expect(relationships.length).toBe(1);
    });
});
