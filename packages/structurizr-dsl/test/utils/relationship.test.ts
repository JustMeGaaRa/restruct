import { beforeAll, describe, expect, test } from "vitest";
import { createImpliedReltionshipsDummy } from "../workspace";
import {
    IWorkspace,
    getElementTree,
    isContainer,
    isPerson,
    isSoftwareSystem,
    visitImpliedRelationships,
    visitWorkspaceHierarchy,
    visitWorkspaceRelationships,
} from "../../src";

describe("visitWorkspaceHierarchy", () => {
    test("should have 1 person, 1 software system, 1 container", () => {
        const workspace = createImpliedReltionshipsDummy();
        const elements = visitWorkspaceHierarchy(workspace.model);

        expect(elements).toBeDefined();
        expect(elements.length).toBe(3);
        expect(elements.filter(isPerson)).toHaveLength(1);
        expect(elements.filter(isSoftwareSystem)).toHaveLength(1);
        expect(elements.filter(isContainer)).toHaveLength(1);
    });
});

describe("visitWorkspaceRelationships", () => {
    test("should have 1 relationship", () => {
        const workspace = createImpliedReltionshipsDummy();
        const relationships = visitWorkspaceRelationships(workspace.model);

        expect(relationships).toBeDefined();
        expect(relationships.length).toBe(1);
    });
});

describe("getElementTree", () => {
    test("should have 1 person, 1 software system, 1 container", () => {
        const workspace = createImpliedReltionshipsDummy();
        const elementTree = getElementTree(workspace.model);

        expect(elementTree).toBeDefined();
        expect(elementTree.size).toBe(3);
    });
});

describe("visitImpliedRelationships", () => {
    test("should have 2 relationships ncluding implied ones", () => {
        const workspace = createImpliedReltionshipsDummy();
        const impliedRelationships = visitImpliedRelationships(workspace.model);

        expect(impliedRelationships).toBeDefined();
        expect(impliedRelationships.length).toBe(2);
    });
});
