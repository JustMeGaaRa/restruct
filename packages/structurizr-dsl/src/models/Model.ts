import { IModel } from "../interfaces";
import { ISupportSnapshot } from "../shared";
import { DeploymentEnvironment } from "./DeploymentEnvironment";
import { Group } from "./Group";
import { Person } from "./Person";
import { Relationship } from "./Relationship";
import { SoftwareSystem } from "./SoftwareSystem";

export class Model implements ISupportSnapshot<IModel> {
    constructor(params: IModel) {
        this.people = params.people
            ? params.people.map((p) => new Person(p))
            : [];
        this.softwareSystems = params.softwareSystems
            ? params.softwareSystems.map((s) => new SoftwareSystem(s))
            : [];
        this.deploymentEnvironments = params.deploymentEnvironments
            ? params.deploymentEnvironments.map(
                  (d) => new DeploymentEnvironment(d)
              )
            : [];
        this.relationships = params.relationships
            ? params.relationships.map((r) => new Relationship(r))
            : [];
        this.groups = params.groups
            ? params.groups.map((g) => new Group(g))
            : [];
    }

    public readonly people: Person[];
    public readonly softwareSystems: SoftwareSystem[];
    public readonly deploymentEnvironments: DeploymentEnvironment[];
    public readonly relationships: Relationship[];
    public readonly groups: Group[];

    public toSnapshot(): IModel {
        return {
            people: this.people.map((p) => p.toSnapshot()),
            softwareSystems: this.softwareSystems.map((s) => s.toSnapshot()),
            deploymentEnvironments: this.deploymentEnvironments.map((d) =>
                d.toSnapshot()
            ),
            relationships: this.relationships.map((r) => r.toSnapshot()),
            groups: this.groups.map((g) => g.toSnapshot()),
        };
    }
}
