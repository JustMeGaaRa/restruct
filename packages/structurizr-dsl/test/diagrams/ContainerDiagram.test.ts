import { beforeAll, describe, expect, test } from "vitest";
import {
    IContainerDiagram,
    IWorkspace,
    createContainerDiagram,
    isPerson,
    isSoftwareSystem,
} from "../../src";
import {
    createImpliedRelationshipDummy2,
    createBigBankPlcWorkspace,
} from "../workspace";

describe("Container Diagram (Big Bank Plc.)", () => {
    let workspace: IWorkspace;
    let diagram: IContainerDiagram;

    beforeAll(() => {
        workspace = createBigBankPlcWorkspace();
        diagram = createContainerDiagram(
            workspace,
            workspace.views.containers.at(0)!
        );
    });

    test("should create a container diagram", () => {
        expect(diagram).toBeDefined();
    });

    test("should have scope defined", () => {
        expect(diagram.scope).toBeDefined();
        expect(isSoftwareSystem(diagram.scope)).toBe(true);
    });

    test("should have primary elements with exactly 5 containers", () => {
        expect(diagram.scope.containers).toBeDefined();
        expect(diagram.scope.containers).toHaveLength(5);
    });

    test("should have supporting elements with exactly 1 person", () => {
        expect(diagram.supportingElements).toBeDefined();
        expect(diagram.supportingElements).toHaveLength(3);
        expect(diagram.supportingElements.filter(isPerson)).toHaveLength(1);
    });

    test("should have supporting elements with exactly 2 software systems", () => {
        expect(diagram.supportingElements).toBeDefined();
        expect(diagram.supportingElements).toHaveLength(3);
        expect(
            diagram.supportingElements.filter(isSoftwareSystem)
        ).toHaveLength(2);
    });

    test("should have 10 relationships", () => {
        expect(diagram.relationships).toBeDefined();
        expect(diagram.relationships).toHaveLength(10);
    });
});

describe("Container Diagram (Implied Relationships)", () => {
    let workspace: IWorkspace;
    let diagram: IContainerDiagram;

    beforeAll(() => {
        workspace = createImpliedRelationshipDummy2();
        diagram = createContainerDiagram(
            workspace,
            workspace.views.containers.at(0)!
        );
    });

    test("should create a container diagram", () => {
        expect(diagram).toBeDefined();
    });

    test("should have scope defined", () => {
        expect(diagram.scope).toBeDefined();
        expect(isSoftwareSystem(diagram.scope)).toBe(true);
    });

    test("should have primary elements with exactly 2 Containers", () => {
        expect(diagram.scope.containers).toBeDefined();
        expect(diagram.scope.containers).toHaveLength(2);
    });

    test("should have supporting elements with exactly 2 Software System", () => {
        expect(diagram.supportingElements).toBeDefined();
        expect(diagram.supportingElements).toHaveLength(2);
        expect(
            diagram.supportingElements.filter(isSoftwareSystem)
        ).toHaveLength(2);
    });

    test("should have exactly 3 relationships", () => {
        expect(diagram.relationships).toBeDefined();
        expect(diagram.relationships).toHaveLength(3);
    });
});
