import { describe, expect, test } from "vitest";
import {
    getViewsWithDefaults,
    getWorkspaceComponents,
    getWorkspaceContainers,
    // getWorkspaceDeploymentEnvironments,
    getWorkspaceSoftwareSystems,
} from "../../src";
import { createWorkspaceWithNoViews } from "../workspace";

describe("getViewsWithDefaults", () => {
    test("should create default views for a workspace", () => {
        const workspace = createWorkspaceWithNoViews();
        const views = getViewsWithDefaults(workspace);

        expect(views.systemLandscape).toBeDefined();
        expect(views.systemContexts.length).toBe(
            getWorkspaceSoftwareSystems(workspace.model).length
        );
        expect(views.containers.length).toBe(
            getWorkspaceContainers(workspace.model).length
        );
        expect(views.components.length).toBe(
            getWorkspaceComponents(workspace.model).length
        );
        // expect(views.deployments.length).toBe(
        //     getWorkspaceDeploymentEnvironments(workspace.model).length
        // );
    });
});
