import { describe, expect, test } from "vitest";
import { WorkspaceBuilder } from "../../../src/models";

describe("Workspace Builder", () => {
    test("should create a workspace", () => {
        const builder = new WorkspaceBuilder("Big Bank plc");
        const workspace = builder.build();

        expect(workspace).toBeDefined();
        expect(workspace.model).toBeDefined();
        expect(workspace.views).toBeDefined();
    });

    test.each([
        "Test Description",
        "Another Test Description",
        "One more test description",
    ])("should set a workspace description", (description: string) => {
        const builder = new WorkspaceBuilder(
            "Big Bank plc",
            "This is a model of Big Bank plc."
        );
        builder.description(description);
        const workspace = builder.build();

        expect(workspace.description).toBeDefined();
        expect(workspace.description).toBe(description);
    });

    test("should have defined model", () => {
        const builder = new WorkspaceBuilder("Big Bank plc");
        const model = builder.model(() => {});
        const workspace = builder.build();

        expect(workspace.model).toBeDefined();
        expect(model).toBeDefined();
    });

    test("should have defined views", () => {
        const builder = new WorkspaceBuilder("Big Bank plc");
        const views = builder.views(() => {});
        const workspace = builder.build();

        expect(workspace.views).toBeDefined();
        expect(views).toBeDefined();
    });

    test("should build a workspace with 2 people", () => {
        const builder = new WorkspaceBuilder("Big Bank plc");
        const model = builder.model((model) => {
            model.person("Alice", "A person.");
            model.person("Bob", "Another person.");
        });
        const workspace = builder.build();

        expect(workspace.model).toBeDefined();
        expect(workspace.model.people).toBeDefined();
        expect(workspace.model.people.length).toBe(2);
        expect(model).toBeDefined();
        expect(model.people).toBeDefined();
        expect(model.people.length).toBe(2);
    });

    test("should build a workspace with view of each type", () => {
        const builder = new WorkspaceBuilder("Big Bank plc");
        const views = builder.views((views) => {
            views.systemLandscapeView("key");
            views.systemContextView("softwareSystem", "key");
            views.containerView("softwareSystem", "key");
            views.componentView("container", "key");
            views.deploymentView("softwareSystem", "development", "key");
        });
        const workspace = builder.build();

        expect(workspace.views).toBeDefined();
        expect(workspace.views.systemLandscape).toBeDefined();
        expect(workspace.views.systemContexts).toBeDefined();
        expect(workspace.views.systemContexts.length).toBe(1);
        expect(workspace.views.containers).toBeDefined();
        expect(workspace.views.containers.length).toBe(1);
        expect(workspace.views.components).toBeDefined();
        expect(workspace.views.components.length).toBe(1);
        expect(workspace.views.deployments).toBeDefined();
        expect(workspace.views.deployments.length).toBe(1);
        expect(views).toBeDefined();
    });
});
