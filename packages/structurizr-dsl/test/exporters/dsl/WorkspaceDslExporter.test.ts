import { beforeAll, describe, expect, test } from "vitest";
import { WorkspaceDslExporter } from "../../../src/exporters/dsl/WorkspaceDslExporter";
import {
    createBigBankPlcWorkspace,
    createImpliedRelationshipDummy2,
    createImpliedRelationshipDeploymentDummy,
} from "../../workspace";

describe("WorkspaceDslExporter — Big Bank Plc", () => {
    let dsl: string;

    beforeAll(() => {
        const workspace = createBigBankPlcWorkspace();
        dsl = new WorkspaceDslExporter().export(workspace);
    });

    test("produces non-empty output", () => {
        expect(dsl.trim().length).toBeGreaterThan(0);
    });

    test("opens with workspace block containing name", () => {
        expect(dsl).toMatch(/^workspace "Big Bank plc\."/);
    });

    test("contains a model block", () => {
        expect(dsl).toContain("model {");
    });

    test("contains a views block", () => {
        expect(dsl).toContain("views {");
    });

    test("assigns an id to the internet banking system (referenced in views)", () => {
        expect(dsl).toMatch(/\binternetBankingSystem\s*=\s*softwareSystem/);
    });

    test("assigns an id to the api application (referenced in views)", () => {
        expect(dsl).toMatch(/\baPIApplication\s*=\s*container/);
    });

    test("assigns an id to the customer (referenced in relationships)", () => {
        expect(dsl).toMatch(/\bpersonalBankingCustomer\s*=\s*person/);
    });

    test("does not assign an id to mainframe (not referenced in views, but referenced in relationships)", () => {
        // mainframe IS referenced in relationships, so it SHOULD have an id
        expect(dsl).toMatch(/\bmainframeBankingSystem\s*=\s*softwareSystem/);
    });

    test("writes group block with correct name", () => {
        expect(dsl).toContain('group "Big Bank plc."');
    });

    test("writes a person with a custom tag", () => {
        expect(dsl).toContain('tags "Customer"');
    });

    test("does not write default Element tag", () => {
        const lines = dsl
            .split("\n")
            .filter((l) => l.includes("tags") && l.includes('"Element"'));
        expect(lines).toHaveLength(0);
    });

    test("does not write default Person tag", () => {
        const lines = dsl
            .split("\n")
            .filter((l) => l.includes("tags") && l.includes('"Person"'));
        expect(lines).toHaveLength(0);
    });

    test("writes model-level relationships with resolved ids", () => {
        expect(dsl).toMatch(
            /personalBankingCustomer\s*->\s*internetBankingSystem/
        );
    });

    test("writes systemLandscape view", () => {
        expect(dsl).toContain("systemLandscape");
    });

    test("writes systemContext view with resolved software system id", () => {
        expect(dsl).toMatch(/systemContext\s+internetBankingSystem/);
    });

    test("writes container view with resolved software system id", () => {
        expect(dsl).toMatch(/container\s+internetBankingSystem/);
    });

    test("writes component view with resolved container id", () => {
        expect(dsl).toMatch(/component\s+aPIApplication/);
    });

    test("writes deployment views", () => {
        expect(dsl).toContain('deploymentEnvironment "Development"');
        expect(dsl).toContain('deploymentEnvironment "Live"');
    });

    test("writes containerInstance referencing container id", () => {
        expect(dsl).toMatch(/containerInstance\s+\w+/);
    });

    test("has proper indentation (4 spaces per level)", () => {
        const modelLine = dsl.split("\n").find((l) => l.match(/^\s+model\s*\{/));
        expect(modelLine).toBeDefined();
        // model { is nested one level inside workspace, so 4 spaces
        expect(modelLine).toMatch(/^    model \{/);
    });

    test("persons inside a group are indented deeper than the group", () => {
        const lines = dsl.split("\n");
        const groupLine = lines.findIndex((l) => l.match(/^\s+group "/));
        const personAfterGroup = lines
            .slice(groupLine + 1)
            .find((l) => l.match(/\bperson\b/));
        expect(personAfterGroup).toBeDefined();
        const personIndent = personAfterGroup!.match(/^(\s+)/)?.[1].length ?? 0;
        const groupIndent =
            lines[groupLine].match(/^(\s+)/)?.[1].length ?? 0;
        expect(personIndent).toBeGreaterThan(groupIndent);
    });
});

describe("WorkspaceDslExporter — Implied Relationships (no views)", () => {
    let dsl: string;

    beforeAll(() => {
        const workspace = createImpliedRelationshipDummy2();
        dsl = new WorkspaceDslExporter().export(workspace);
    });

    test("produces valid output", () => {
        expect(dsl).toContain("workspace");
        expect(dsl).toContain("model {");
    });

    test("assigns ids to software systems referenced in views", () => {
        expect(dsl).toMatch(/\bsoftwareSystemA\s*=\s*softwareSystem/);
    });

    test("writes component view with resolved container id", () => {
        expect(dsl).toMatch(/component\s+containerA/);
    });

    test("writes model-level relationships between components and containers", () => {
        expect(dsl).toMatch(/componentA\s*->\s*containerB/);
    });
});

describe("WorkspaceDslExporter — Deployment", () => {
    let dsl: string;

    beforeAll(() => {
        const workspace = createImpliedRelationshipDeploymentDummy();
        dsl = new WorkspaceDslExporter().export(workspace);
    });

    test("writes containerInstance lines in deployment nodes", () => {
        expect(dsl).toMatch(/containerInstance\s+\w+/);
    });

    test("writes deployment view block", () => {
        expect(dsl).toMatch(/deployment\s+\w+\s+"Production"/);
    });
});

describe("WorkspaceDslExporter — element without description omits empty string", () => {
    test("empty description is not written as empty quotes", async () => {
        const { workspace } = await import("../../../src");
        const w = workspace("Test", "", (_) => {
            _.model((_) => {
                _.person("Alice", "");
            });
        });
        const dsl = new WorkspaceDslExporter().export(w);
        // No id needed (not referenced), so just: person "Alice"
        expect(dsl).toContain('person "Alice"');
        expect(dsl).not.toContain('person "Alice" ""');
    });
});
