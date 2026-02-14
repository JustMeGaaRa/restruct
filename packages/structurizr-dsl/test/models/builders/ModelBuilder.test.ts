import { describe, expect, test } from "vitest";
import { ModelBuilder } from "../../../src/models";

describe("Model Builder", () => {
    test("should build a model", () => {
        const builder = new ModelBuilder();
        const model = builder.build();

        expect(model).toBeDefined();
    });

    test("should add a person to the model", () => {
        const builder = new ModelBuilder();
        const person = builder.person("Alice");
        const model = builder.build();

        expect(model.people).toBeDefined();
        expect(model.people.length).toBe(1);
        expect(model.people.at(0)?.name).toBe("Alice");
        expect(model.people.at(0)?.identifier).toBe(person.identifier);
        expect(person).toBeDefined();
        expect(person.name).toBe("Alice");
    });

    test("should add a software system to the model", () => {
        const builder = new ModelBuilder();
        const softwareSystem = builder.softwareSystem("Software System");
        const model = builder.build();

        expect(model.softwareSystems).toBeDefined();
        expect(model.softwareSystems.length).toBe(1);
        expect(model.softwareSystems.at(0)?.name).toBe("Software System");
        expect(model.softwareSystems.at(0)?.identifier).toBe(
            softwareSystem.identifier
        );
        expect(softwareSystem).toBeDefined();
        expect(softwareSystem.name).toBe("Software System");
    });

    test.each(["Development", "Staging", "Production"])(
        "should add a deployment environment to the model",
        (environment: string) => {
            const builder = new ModelBuilder();
            const deploymentEnvironment = builder.deploymentEnvironment(
                environment,
                () => {}
            );
            const model = builder.build();

            expect(model.deploymentEnvironments).toBeDefined();
            expect(model.deploymentEnvironments.length).toBe(1);
            expect(model.deploymentEnvironments.at(0)?.name).toBe(environment);
            expect(model.deploymentEnvironments.at(0)?.identifier).toBe(
                deploymentEnvironment.identifier
            );
            expect(deploymentEnvironment).toBeDefined();
            expect(deploymentEnvironment.name).toBe(environment);
        }
    );

    test("should add a group to the model", () => {
        const builder = new ModelBuilder();
        const group = builder.group("Group", () => {});
        const model = builder.build();

        expect(model.groups).toBeDefined();
        expect(model.groups.length).toBe(1);
        expect(model.groups.at(0)?.name).toBe("Group");
        expect(model.groups.at(0)?.identifier).toBeTruthy();
        expect(model.groups.at(0)?.identifier).toBe(group.identifier);
        expect(group).toBeDefined();
        expect(group.name).toBe("Group");
        expect(group.identifier).toBeTruthy();
    });

    test("should add a relationship", () => {
        const builder = new ModelBuilder();
        const person = builder.person("Alice", "A person.");
        const softwareSystem = builder.softwareSystem(
            "Software System",
            "A software system."
        );
        const relationship = builder.uses(
            person.identifier,
            softwareSystem.identifier,
            "Uses"
        );
        const model = builder.build();

        expect(model.relationships).toBeDefined();
        expect(model.relationships.length).toBe(1);
        expect(model.relationships.at(0)?.sourceIdentifier).not.toBe("Alice");
        expect(model.relationships.at(0)?.sourceIdentifier).toBe(
            person.identifier
        );
        expect(model.relationships.at(0)?.targetIdentifier).not.toBe(
            "Software System"
        );
        expect(model.relationships.at(0)?.targetIdentifier).toBe(
            softwareSystem.identifier
        );
        expect(model.relationships.at(0)?.description).toBe("Uses");
        expect(relationship).toBeDefined();
        expect(relationship.sourceIdentifier).toBe(person.identifier);
        expect(relationship.targetIdentifier).toBe(softwareSystem.identifier);
        expect(relationship.description).toBe("Uses");
    });
});
