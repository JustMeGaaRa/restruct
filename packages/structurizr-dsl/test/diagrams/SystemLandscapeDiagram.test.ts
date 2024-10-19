import { beforeAll, describe, expect, test } from "vitest";
import {
    createBigBankPlcWorkspace,
    createImpliedRelationshipDummy2,
} from "../workspace";
import {
    ISystemLandscapeDiagram,
    IWorkspace,
    createSystemLandscapeDiagram,
    isModel,
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

    test("should have an software system as scope", () => {
        expect([diagram.scope].filter(isModel)).toHaveLength(1);
    });

    test("should have primary elements with 3 people", () => {
        expect(diagram.scope.people).toBeDefined();
        expect(
            diagram.scope.groups
                .flatMap((x) => x.people)
                .concat(diagram.scope.people)
        ).toHaveLength(3);
    });

    test("should have primary elements with 4 software systems", () => {
        expect(diagram.scope.softwareSystems).toBeDefined();
        expect(
            diagram.scope.groups
                .flatMap((x) => x.softwareSystems)
                .concat(diagram.scope.softwareSystems)
        ).toHaveLength(4);
    });

    test("should have primary elements with 1 group", () => {
        expect(diagram.scope.groups).toBeDefined();
        expect(diagram.scope.groups).toHaveLength(1);
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
        expect(diagram.scope.softwareSystems).toBeDefined();
        expect(diagram.scope.softwareSystems).toHaveLength(3);
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
