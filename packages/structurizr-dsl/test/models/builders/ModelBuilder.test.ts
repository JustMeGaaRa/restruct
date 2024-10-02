import { describe, expect, test } from "vitest";
import { ModelBuilder } from "../../../src/models";
import { IPerson } from "../../../src/interfaces";

describe("Model Builder", () => {
    test("should build a model", () => {
        const builder = new ModelBuilder();
        const model = builder.build();

        expect(model).toBeDefined();
    });

    test("should add a person", () => {
        const builder = new ModelBuilder();
        const person = builder.person("Alice", "A person.");
        const model = builder.build();

        expect(model.people).toBeDefined();
        expect(model.people.length).toBe(1);
        expect(model.people.at(0)?.name).toBe("Alice");
        expect(model.people.at(0)?.identifier).toBe(person.identifier);
        expect(person).toBeDefined();
        expect(person.name).toBe("Alice");
        expect(person.description).toBe("A person.");
        expect(person.identifier).toBeTruthy();
    });

    test("should add a software system", () => {
        const builder = new ModelBuilder();
        const softwareSystem = builder.softwareSystem(
            "Software System",
            "A software system."
        );
        const model = builder.build();

        expect(model.softwareSystems).toBeDefined();
        expect(model.softwareSystems.length).toBe(1);
        expect(model.softwareSystems.at(0)?.name).toBe("Software System");
        expect(model.softwareSystems.at(0)?.identifier).toBe(
            softwareSystem.identifier
        );
        expect(softwareSystem).toBeDefined();
        expect(softwareSystem.name).toBe("Software System");
        expect(softwareSystem.description).toBe("A software system.");
        expect(softwareSystem.identifier).toBeTruthy();
    });

    test.each(["Development", "Staging", "Production"])(
        "should add a deployment environment",
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
            expect(deploymentEnvironment.identifier).toBeTruthy();
        }
    );

    test("should add a group", () => {
        const builder = new ModelBuilder();
        let alice: IPerson;
        let bob: IPerson;
        const group = builder.group("Group", (group) => {
            alice = group.person("Alice", "A person.");
            bob = group.person("Bob", "Another person.");
        });
        const model = builder.build();

        expect(model.groups).toBeDefined();
        expect(model.groups.length).toBe(1);
        expect(model.groups.at(0)?.name).toBe("Group");
        expect(model.groups.at(0)?.people).toBeDefined();
        expect(model.groups.at(0)?.people.length).toBe(2);
        expect(model.groups.at(0)?.people.at(0)?.name).toBe("Alice");
        expect(model.groups.at(0)?.people.at(1)?.name).toBe("Bob");
        expect(group).toBeDefined();
        expect(alice!).toBeDefined();
        expect(alice!.name).toBe("Alice");
        expect(alice!.description).toBe("A person.");
        expect(alice!.identifier).toBeTruthy();
        expect(bob!).toBeDefined();
        expect(bob!.name).toBe("Bob");
        expect(bob!.description).toBe("Another person.");
        expect(bob!.identifier).toBeTruthy();
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

    test("should throw error when adding relationship with non-existing elements", () => {
        const builder = new ModelBuilder();

        expect(() =>
            builder.uses("Alice", "Software System", "Uses")
        ).toThrowError();
    });
});