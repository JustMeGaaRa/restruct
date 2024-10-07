import { describe, expect, test } from "vitest";
import { createImpliedRelationshipsDummy } from "../workspace";
import {
    getElementParentMap,
    isContainer,
    isPerson,
    isSoftwareSystem,
    visitWorkspaceHierarchy,
    visitWorkspaceRelationships,
} from "../../src";

describe("visitWorkspaceHierarchy", () => {
    test("should have 1 person, 1 software system, 1 container", () => {
        const workspace = createImpliedRelationshipsDummy();
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
        const workspace = createImpliedRelationshipsDummy();
        const relationships = visitWorkspaceRelationships(workspace.model);

        expect(relationships).toBeDefined();
        expect(relationships.length).toBe(1);
    });
});

describe("getElementTree", () => {
    test("should have 1 person, 1 software system, 1 container", () => {
        const workspace = createImpliedRelationshipsDummy();
        const elementTree = getElementParentMap(workspace.model);

        expect(elementTree).toBeDefined();
        expect(elementTree.size).toBe(3);
    });
});
