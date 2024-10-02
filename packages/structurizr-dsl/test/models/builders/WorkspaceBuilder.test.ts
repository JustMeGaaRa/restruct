import { describe, expect, test } from "vitest";
import { WorkspaceBuilder } from "../../../src/models";

describe("Workspace Builder", () => {
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

    test("should build a workspace", () => {
        const builder = new WorkspaceBuilder("Big Bank plc");
        const workspace = builder.build();

        expect(workspace).toBeDefined();
    });

    test("should set a model", () => {
        const builder = new WorkspaceBuilder("Big Bank plc");
        const model = builder.model((model) => {});
        const workspace = builder.build();

        expect(workspace.model).toBeDefined();
        expect(workspace.model).toBeDefined();
    });

    test("should set views", () => {
        const builder = new WorkspaceBuilder("Big Bank plc");
        const views = builder.views((views) => {});
        const workspace = builder.build();

        expect(workspace.views).toBeDefined();
        expect(workspace.views).toBeDefined();
    });

    test("should build a workspace with a model and views", () => {
        const builder = new WorkspaceBuilder("Big Bank plc");
        const model = builder.model((model) => {
            model.person("Alice", "A person.");
            model.person("Bob", "Another person.");
        });
        const workspace = builder.build();

        expect(workspace.model).toBeDefined();
        expect(workspace.views).toBeDefined();
    });
});
