import { beforeAll, describe, expect, test } from "vitest";
import {
    IDeploymentDiagram,
    IWorkspace,
    createDeploymentDiagram,
    isContainerInstance,
    isSoftwareSystemInstance,
} from "../../src";
import {
    createBigBankPlcWorkspace,
    createImpliedRelationshipDeploymentDummy,
} from "../workspace";

describe("Deployment Diagram (Big Bank Plc.)", () => {
    let workspace: IWorkspace;
    let diagram: IDeploymentDiagram;

    beforeAll(() => {
        workspace = createBigBankPlcWorkspace();
        diagram = createDeploymentDiagram(
            workspace,
            workspace.views.deployments.at(0)!
        );
    });

    test("should create a deployment diagram", () => {
        expect(diagram).toBeDefined();
    });

    test("should have scope defined based on the environment", () => {
        expect(diagram.scope).toBeDefined();
        expect(diagram.scope.name).toBe("Development");
    });

    test("should have 2 deployment nodes at the root level", () => {
        expect(diagram.scope.deploymentNodes).toBeDefined();
        expect(diagram.scope.deploymentNodes).toHaveLength(2);
    });

    test("should have supporting elements with exactly 1 software system instances", () => {
        expect(diagram.supportingElements).toBeDefined();
        expect(
            diagram.supportingElements.filter(isSoftwareSystemInstance)
        ).toHaveLength(1);
    });

    test("should have supporting elements with exactly 4 container instances", () => {
        expect(diagram.supportingElements).toBeDefined();
        expect(
            diagram.supportingElements.filter(isContainerInstance)
        ).toHaveLength(4);
    });

    test("should have exactly 4 relationships between the instances", () => {
        expect(diagram.relationships).toBeDefined();
        expect(diagram.relationships).toHaveLength(4);
    });
});

describe("Deployment Diagram (Implied Relationships)", () => {
    let workspace: IWorkspace;
    let diagram: IDeploymentDiagram;

    beforeAll(() => {
        workspace = createImpliedRelationshipDeploymentDummy();
        diagram = createDeploymentDiagram(
            workspace,
            workspace.views.deployments.at(0)!
        );
    });

    test("should create a deployment diagram", () => {
        expect(diagram).toBeDefined();
    });

    test("should have scope defined based on the environment", () => {
        expect(diagram.scope).toBeDefined();
        expect(diagram.scope.name).toBe("Production");
    });

    test("should have 2 deployment nodes at the root level", () => {
        expect(diagram.scope.deploymentNodes).toBeDefined();
        expect(diagram.scope.deploymentNodes).toHaveLength(2);
    });

    test("should have supporting elements with exactly 2 Container Instances", () => {
        expect(diagram.supportingElements).toBeDefined();
        expect(
            diagram.supportingElements.filter(isContainerInstance)
        ).toHaveLength(2);
    });

    test("should have exactly 1 explicit/implied relationship between the instances", () => {
        expect(diagram.relationships).toBeDefined();
        expect(diagram.relationships).toHaveLength(1);
    });
});
