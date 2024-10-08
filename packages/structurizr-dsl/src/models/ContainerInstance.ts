import {
    DeploymentGroup,
    ElementType,
    IContainerInstance,
    Identifier,
    Url,
} from "../interfaces";
import { ISupportSnapshot } from "../shared";
import { Relationship } from "./Relationship";
import { Tag } from "./Tag";
import { String } from "../utils/string";

type ContainerInstanceParams = Required<
    Pick<IContainerInstance, "containerIdentifier">
> &
    Partial<Omit<IContainerInstance, "type" | "containerIdentifier">>;

export class ContainerInstance implements ISupportSnapshot<IContainerInstance> {
    constructor(params: ContainerInstanceParams) {
        this.type = ElementType.ContainerInstance;
        this.identifier = Identifier.createOrDefault(params.identifier);
        this.containerIdentifier = Identifier.parse(params.containerIdentifier);
        this.deploymentGroups = params.deploymentGroups ?? [];
        this.relationships = params.relationships
            ? params.relationships.map((r) => new Relationship(r))
            : [];
        this.description = params.description;
        this.url = params.url;
        // this.properties = params.properties;
        // this.perspectives = params.perspectives;
        // this.healthCheck = params.healthCheck;
        this.tags = [
            Tag.ContainerInstance,
            ...(params.tags
                ?.map((t) => new Tag(t.name))
                ?.filter(
                    (x) =>
                        !String.equalsIgnoreCase(
                            x.name,
                            Tag.ContainerInstance.name
                        )
                ) ?? []),
        ];
    }

    public readonly type: ElementType.ContainerInstance;
    public readonly identifier: Identifier;
    public readonly containerIdentifier: Identifier;
    public readonly deploymentGroups?: DeploymentGroup[];
    public readonly relationships?: Relationship[];
    public readonly description?: string;
    public readonly tags?: Tag[];
    public readonly url?: Url;
    // public readonly properties?: Properties;
    // public readonly perspectives?: Perspectives;
    // public readonly healthCheck?: HealthCheck;

    public toSnapshot(): IContainerInstance {
        return {
            type: this.type,
            identifier: this.identifier.toString(),
            containerIdentifier: this.containerIdentifier.toString(),
            deploymentGroups: this.deploymentGroups,
            relationships: this.relationships?.map((r) => r.toSnapshot()) ?? [],
            description: this.description,
            tags: this.tags,
            url: this.url,
            // properties: this.properties,
            // perspectives: this.perspectives,
            // healthCheck: this.healthCheck
        };
    }
}
