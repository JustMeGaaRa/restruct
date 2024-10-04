import { beforeAll, describe, expect, test } from "vitest";
import { createBigBankPlcWorkspace } from "../workspace";
import { SystemLandscapeDiagram } from "../../src/diagrams";
import {
    ISystemLandscapeDiagram,
    IWorkspace,
    isGroup,
    isPerson,
    isSoftwareSystem,
} from "../../src";

describe("System Landscape Diagram", () => {
    let workspace: IWorkspace;
    let diagram: ISystemLandscapeDiagram;

    beforeAll(() => {
        workspace = createBigBankPlcWorkspace();
        diagram = new SystemLandscapeDiagram(
            workspace,
            workspace.views.systemLandscape!
        ).build();
    });

    test("should create a system landscape diagram", () => {
        const diagram = new SystemLandscapeDiagram(
            workspace,
            workspace.views.systemLandscape!
        ).build();

        expect(diagram).toBeDefined();
    });

    test("should have an undefined scope", () => {
        expect(diagram.scope).toBeUndefined();
    });

    test("should have primary elements with 3 persons", () => {
        expect(diagram.primaryElements).toBeDefined();
        expect(diagram.primaryElements.filter(isPerson)).toHaveLength(3);
    });

    test("should have primary elements with 4 software systems", () => {
        expect(diagram.primaryElements).toBeDefined();
        expect(diagram.primaryElements.filter(isSoftwareSystem)).toHaveLength(
            4
        );
    });

    test("should have primary elements with 1 group", () => {
        expect(diagram.primaryElements).toBeDefined();
        expect(diagram.primaryElements.filter(isGroup)).toHaveLength(1);
    });

    test("should have none supporting elements", () => {
        expect(diagram.supportingElements).toBeDefined();
        expect(diagram.supportingElements.length).toBe(0);
    });

    test("should have 9 relationships", () => {
        expect(diagram.relationships).toBeDefined();
        expect(diagram.relationships.length).toBe(9);
    });
});
