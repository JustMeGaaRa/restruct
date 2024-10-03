import { ElementType, IDeploymentNode, Identifier, Url } from "../interfaces";
import { ISupportSnapshot } from "../shared";
import { ContainerInstance } from "./ContainerInstance";
import { InfrastructureNode } from "./InfrastructureNode";
import { Relationship } from "./Relationship";
import { SoftwareSystemInstance } from "./SoftwareSystemInstance";
import { Tag } from "./Tag";
import { Technology } from "./Technology";
import { String } from "../utils/string";

type DeploymentNodeValues = Required<Pick<IDeploymentNode, "name">> &
    Partial<Omit<IDeploymentNode, "type" | "name">>;

export class DeploymentNode implements ISupportSnapshot<IDeploymentNode> {
    constructor(params: DeploymentNodeValues) {
        this.type = ElementType.DeploymentNode;
        this.identifier = Identifier.createOrDefault(params.identifier);
        this.name = params.name;
        this.deploymentNodes = params.deploymentNodes
            ? params.deploymentNodes.map((d) => new DeploymentNode(d))
            : [];
        this.infrastructureNodes = params.infrastructureNodes
            ? params.infrastructureNodes.map((i) => new InfrastructureNode(i))
            : [];
        this.softwareSystemInstances = params.softwareSystemInstances
            ? params.softwareSystemInstances.map(
                  (s) => new SoftwareSystemInstance(s)
              )
            : [];
        this.containerInstances = params.containerInstances
            ? params.containerInstances.map((c) => new ContainerInstance(c))
            : [];
        this.technology = params.technology
            ? params.technology.map((x) => new Technology(x))
            : [];
        this.description = params.description;
        this.instances = params.instances;
        this.url = params.url;
        // this.properties = params.properties;
        // this.perspectives = params.perspectives;
        this.relationships = params.relationships
            ? params.relationships.map((r) => new Relationship(r))
            : [];
        this.tags = [
            Tag.Element,
            Tag.DeploymentNode,
            ...(params.tags
                ?.map((t) => new Tag(t.name))
                ?.filter(
                    (x) => !String.equalsIgnoreCase(x.name, Tag.Element.name)
                )
                ?.filter(
                    (x) =>
                        !String.equalsIgnoreCase(
                            x.name,
                            Tag.DeploymentNode.name
                        )
                ) ?? []),
        ];
    }

    public readonly type: ElementType.DeploymentNode;
    public readonly identifier: Identifier;
    public readonly name: string;
    public readonly deploymentNodes: DeploymentNode[];
    public readonly infrastructureNodes: InfrastructureNode[];
    public readonly softwareSystemInstances: SoftwareSystemInstance[];
    public readonly containerInstances: ContainerInstance[];
    public readonly technology: Technology[];
    public readonly description?: string;
    public readonly instances?: number;
    public readonly tags: Tag[];
    public readonly url?: Url;
    // public readonly properties?: Properties;
    // public readonly perspectives?: Perspectives;
    public readonly relationships: Relationship[];

    public toSnapshot(): IDeploymentNode {
        return {
            type: this.type,
            identifier: this.identifier.toString(),
            name: this.name,
            deploymentNodes: this.deploymentNodes.map((d) => d.toSnapshot()),
            infrastructureNodes: this.infrastructureNodes.map((i) =>
                i.toSnapshot()
            ),
            softwareSystemInstances: this.softwareSystemInstances.map((s) =>
                s.toSnapshot()
            ),
            containerInstances: this.containerInstances.map((c) =>
                c.toSnapshot()
            ),
            technology: this.technology.map((t) => t.name),
            description: this.description,
            instances: this.instances,
            tags: this.tags,
            url: this.url,
            // properties: this.properties,
            // perspectives: this.perspectives,
            relationships: this.relationships.map((r) => r.toSnapshot()),
        };
    }
}
