import { beforeAll, describe, expect, test } from "vitest";
import {
    ISystemContextDiagram,
    IWorkspace,
    SystemContextDiagram,
    isPerson,
    isSoftwareSystem,
} from "../../src";
import {
    createBigBankPlcWorkspace,
    createImpliedRelationshipDummy2,
} from "../workspace";

describe("System Context Diagram (Big Bank Plc.)", () => {
    let workspace: IWorkspace;
    let diagram: ISystemContextDiagram;

    beforeAll(() => {
        workspace = createBigBankPlcWorkspace();
        diagram = new SystemContextDiagram(
            workspace,
            workspace.views.systemContexts.at(0)!
        ).build();
    });

    test("should create a system context diagram", () => {
        expect(diagram).toBeDefined();
    });

    test("should have scope defined", () => {
        expect(diagram.scope).toBeDefined();
        expect(isSoftwareSystem(diagram.scope)).toBe(true);
    });

    test("should have primary elements with 2 software systems", () => {
        expect(diagram.primaryElements).toBeDefined();
        expect(diagram.primaryElements.filter(isSoftwareSystem)).toHaveLength(
            2
        );
    });

    test("should have primary elements with 1 person", () => {
        expect(diagram.primaryElements).toBeDefined();
        expect(diagram.primaryElements.filter(isPerson)).toHaveLength(1);
    });

    test("should have none supporting elements", () => {
        expect(diagram.supportingElements).toBeDefined();
        expect(diagram.supportingElements).toHaveLength(0);
    });

    test("should have 4 relationships", () => {
        expect(diagram.relationships).toBeDefined();
        expect(diagram.relationships).toHaveLength(4);
    });
});

describe("System Context Diagram (Implied Relationships)", () => {
    let workspace: IWorkspace;
    let diagram: ISystemContextDiagram;

    beforeAll(() => {
        workspace = createImpliedRelationshipDummy2();
        diagram = new SystemContextDiagram(
            workspace,
            workspace.views.systemContexts.at(0)!
        ).build();
    });

    test("should create a container diagram", () => {
        expect(diagram).toBeDefined();
    });

    test("should have scope defined", () => {
        expect(diagram.scope).toBeDefined();
        expect(isSoftwareSystem(diagram.scope)).toBe(true);
    });

    test("should have primary elements with 2 Software Systems", () => {
        expect(diagram.primaryElements).toBeDefined();
        expect(diagram.primaryElements.filter(isSoftwareSystem)).toHaveLength(
            2
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
