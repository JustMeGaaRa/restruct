import { beforeAll, describe, expect, test } from "vitest";
import {
    IComponentDiagram,
    IWorkspace,
    createComponentDiagram,
    createDefaultComponentView,
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
        diagram = createComponentDiagram(
            workspace,
            workspace.views.components.at(0)!
        );
    });

    test("should create a component diagram", () => {
        expect(diagram).toBeDefined();
    });

    test("should have scope defined", () => {
        expect(diagram.scope).toBeDefined();
        expect(isContainer(diagram.scope)).toBe(true);
    });

    test("should have primary elements with exactly 6 components", () => {
        expect(diagram.scope.components).toBeDefined();
        expect(diagram.scope.components).toHaveLength(6);
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
        diagram = createComponentDiagram(
            workspace,
            workspace.views.components.at(0)!
        );
    });

    test("should create a component diagram", () => {
        expect(diagram).toBeDefined();
    });

    test("should have scope defined", () => {
        expect(diagram.scope).toBeDefined();
        expect(isContainer(diagram.scope)).toBe(true);
    });

    test("should have primary elements with exactly 2 components", () => {
        expect(diagram.scope.components).toBeDefined();
        expect(diagram.scope.components).toHaveLength(2);
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

describe("Component Diagram (Default View)", () => {
    let workspace: IWorkspace;
    let diagram: IComponentDiagram;

    beforeAll(() => {
        workspace = createBigBankPlcWorkspace();
        const containerId =
            workspace.model.groups[0]!.softwareSystems![3]!.containers![3]!
                .identifier; // API Application
        const defaultComponentView = createDefaultComponentView(containerId);
        diagram = createComponentDiagram(workspace, defaultComponentView);
    });

    test("should create a component diagram", () => {
        expect(diagram).toBeDefined();
    });

    test("should have scope defined", () => {
        expect(diagram.scope).toBeDefined();
        expect(isContainer(diagram.scope)).toBe(true);
    });

    test("should include all components in scope", () => {
        expect(diagram.scope?.components).toBeDefined();
        expect(diagram.scope?.components).toHaveLength(6);
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
});
