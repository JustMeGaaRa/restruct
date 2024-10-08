import { beforeAll, describe, expect, test } from "vitest";
import {
    ComponentDiagram,
    IComponentDiagram,
    IWorkspace,
    isComponent,
    isContainer,
    isSoftwareSystem,
} from "../../src";
import {
    createBigBankPlcWorkspace,
    createImpliedRelationshipDummy2,
} from "../workspace";

describe("Component Diagram (Big Bank Plc.)", () => {
    let workspace: IWorkspace;
    let diagram: IComponentDiagram;

    beforeAll(() => {
        workspace = createBigBankPlcWorkspace();
        diagram = new ComponentDiagram(
            workspace,
            workspace.views.components.at(0)!
        ).build();
    });

    test("should create a component diagram", () => {
        expect(diagram).toBeDefined();
    });

    test("should have scope defined", () => {
        expect(diagram.scope).toBeDefined();
        expect(isContainer(diagram.scope)).toBe(true);
    });

    test("should have primary elements with exactly 6 components", () => {
        expect(diagram.primaryElements).toBeDefined();
        expect(diagram.primaryElements).toHaveLength(6);
        expect(diagram.primaryElements.filter(isComponent)).toHaveLength(6);
    });

    test("should have supporting elements with exactly 2 software systems", () => {
        expect(diagram.supportingElements).toBeDefined();
        expect(diagram.supportingElements).toHaveLength(5);
        expect(
            diagram.supportingElements.filter(isSoftwareSystem)
        ).toHaveLength(2);
    });

    test("should have supporting elements with exactly 3 containers", () => {
        expect(diagram.supportingElements).toBeDefined();
        expect(diagram.supportingElements).toHaveLength(5);
        expect(diagram.supportingElements.filter(isContainer)).toHaveLength(3);
    });

    test("should have 13 relationships", () => {
        expect(diagram.relationships).toBeDefined();
        expect(diagram.relationships).toHaveLength(13);
    });
});

describe("Component Diagram (Implied Relationships)", () => {
    let workspace: IWorkspace;
    let diagram: IComponentDiagram;

    beforeAll(() => {
        workspace = createImpliedRelationshipDummy2();
        diagram = new ComponentDiagram(
            workspace,
            workspace.views.components.at(0)!
        ).build();
    });

    test("should create a component diagram", () => {
        expect(diagram).toBeDefined();
    });

    test("should have scope defined", () => {
        expect(diagram.scope).toBeDefined();
        expect(isContainer(diagram.scope)).toBe(true);
    });

    test("should have primary elements with exactly 2 components", () => {
        expect(diagram.primaryElements).toBeDefined();
        expect(diagram.primaryElements).toHaveLength(2);
        expect(diagram.primaryElements.filter(isComponent)).toHaveLength(2);
    });

    test("should have supporting elements with exactly 1 software system", () => {
        expect(diagram.supportingElements).toBeDefined();
        expect(diagram.supportingElements).toHaveLength(2);
        expect(
            diagram.supportingElements.filter(isSoftwareSystem)
        ).toHaveLength(1);
    });

    test("should have supporting elements with exactly 1 container", () => {
        expect(diagram.supportingElements).toBeDefined();
        expect(diagram.supportingElements).toHaveLength(2);
        expect(diagram.supportingElements.filter(isContainer)).toHaveLength(1);
    });

    test("should have 2 relationships", () => {
        expect(diagram.relationships).toBeDefined();
        expect(diagram.relationships).toHaveLength(2);
    });
});
