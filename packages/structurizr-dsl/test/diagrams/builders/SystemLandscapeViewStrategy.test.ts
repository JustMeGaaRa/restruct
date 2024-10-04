import { describe, expect, test } from "vitest";
import { ISystemLandscapeDiagram } from "../../../src/interfaces";
import {
    SystemLandscapeDiagramVisitor,
    SystemLandscapeViewStrategy,
} from "../../../src/diagrams";
import { createBigBankPlcWorkspace } from "../../workspace";

describe("System Landscape View Strategy", () => {
    test("should create a system landscape view", () => {
        const workspace = createBigBankPlcWorkspace();

        const strategy = new SystemLandscapeViewStrategy(
            workspace.model,
            workspace.views.systemLandscape!
        );
        const diagram: ISystemLandscapeDiagram = {
            scope: undefined,
            primaryElements: [],
            supportingElements: [],
            relationships: [],
        };
        const visitor = new SystemLandscapeDiagramVisitor(diagram);
        strategy.accept(visitor);

        expect(diagram).toBeDefined();
        expect(diagram.scope).toBeUndefined();
        expect(diagram.primaryElements).toBeDefined();
        expect(diagram.supportingElements).toBeDefined();
        expect(diagram.relationships).toBeDefined();
    });
});
