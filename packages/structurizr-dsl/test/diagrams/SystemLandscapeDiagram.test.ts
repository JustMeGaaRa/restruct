import { beforeAll, describe, expect, test } from "vitest";
import {
    createBigBankPlcWorkspace,
    createImpliedRelationshipDummy2,
} from "../workspace";
import {
    ISystemLandscapeDiagram,
    IWorkspace,
    createSystemLandscapeDiagram,
    isGroup,
    isPerson,
    isSoftwareSystem,
} from "../../src";

describe("System Landscape Diagram (Big Bank Plc.)", () => {
    let workspace: IWorkspace;
    let diagram: ISystemLandscapeDiagram;

    beforeAll(() => {
        workspace = createBigBankPlcWorkspace();
        diagram = createSystemLandscapeDiagram(
            workspace,
            workspace.views.systemLandscape!
        );
    });

    test("should create a system landscape diagram", () => {
        expect(diagram).toBeDefined();
    });

    test("should have an undefined scope", () => {
        expect(diagram.scope).toBe("workspace");
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
        expect(diagram.supportingElements).toHaveLength(0);
    });

    test("should have 9 relationships", () => {
        expect(diagram.relationships).toBeDefined();
        expect(diagram.relationships).toHaveLength(9);
    });
});

describe("System Landscape Diagram (Implied Relationships)", () => {
    let workspace: IWorkspace;
    let diagram: ISystemLandscapeDiagram;

    beforeAll(() => {
        workspace = createImpliedRelationshipDummy2();
        diagram = createSystemLandscapeDiagram(
            workspace,
            workspace.views.systemLandscape!
        );
    });

    test("should create a container diagram", () => {
        expect(diagram).toBeDefined();
    });

    test("should have scope defined", () => {
        expect(diagram.scope).toBeDefined();
    });

    test("should have primary elements with 3 Software Systems", () => {
        expect(diagram.primaryElements).toBeDefined();
        expect(diagram.primaryElements.filter(isSoftwareSystem)).toHaveLength(
            3
        );
    });

    test("should have none supporting elements", () => {
        expect(diagram.supportingElements).toBeDefined();
        expect(diagram.supportingElements).toHaveLength(0);
    });

    test("should have 2 relationship", () => {
        expect(diagram.relationships).toBeDefined();
        expect(diagram.relationships).toHaveLength(2);
    });
});
