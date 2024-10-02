import { beforeEach, describe, expect, test } from "vitest";
import {
    IWorkspace,
    SystemLandscapeDiagramVisitor,
    SystemLandscapeViewStrategy,
} from "../../../src";
import { createBigBankPlcWorkspace } from "../../workspace";

describe("System Landscape View Strategy", () => {
    let workspace: IWorkspace = createBigBankPlcWorkspace();

    beforeEach(() => {
        workspace = createBigBankPlcWorkspace();
    });

    test("should create a system landscape view", () => {
        const view = workspace.views.systemLandscape;
        expect(view).toBeDefined();

        const strategy = new SystemLandscapeViewStrategy(
            workspace.model,
            view!
        );
        const visitor = new SystemLandscapeDiagramVisitor();
        strategy.accept(visitor);
        expect(visitor.diagram).toBeDefined();
    });
});
