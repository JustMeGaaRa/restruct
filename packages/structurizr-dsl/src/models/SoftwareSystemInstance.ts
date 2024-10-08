import {
    ElementType,
    ISoftwareSystemInstance,
    Identifier,
    Url,
} from "../interfaces";
import { ISupportSnapshot } from "../shared";
import { Relationship } from "./Relationship";
import { Tag } from "./Tag";
import { String } from "../utils/string";

type SoftwareSystemInstanceParams = Required<
    Pick<ISoftwareSystemInstance, "softwareSystemIdentifier">
> &
    Partial<Omit<ISoftwareSystemInstance, "type" | "softwareSystemIdentifier">>;

export class SoftwareSystemInstance
    implements ISupportSnapshot<ISoftwareSystemInstance>
{
    constructor(params: SoftwareSystemInstanceParams) {
        this.type = ElementType.SoftwareSystemInstance;
        this.identifier = Identifier.createOrDefault(params.identifier);
        this.softwareSystemIdentifier = Identifier.parse(
            params.softwareSystemIdentifier
        );
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
            Tag.SoftwareSystemInstance,
            ...(params.tags
                ?.map((t) => new Tag(t.name))
                ?.filter(
                    (x) =>
                        !String.equalsIgnoreCase(
                            x.name,
                            Tag.SoftwareSystemInstance.name
                        )
                ) ?? []),
        ];
    }

    public readonly type: ElementType.SoftwareSystemInstance;
    public readonly identifier: Identifier;
    public readonly softwareSystemIdentifier: Identifier;
    public readonly deploymentGroups?: Identifier[];
    public readonly relationships?: Relationship[];
    public readonly description?: string;
    public readonly tags?: Tag[];
    public readonly url?: Url;
    // public readonly properties?: Properties;
    // public readonly perspectives?: Perspectives;
    // public readonly healthCheck?: HealthCheck;

    public toSnapshot(): ISoftwareSystemInstance {
        return {
            type: this.type,
            identifier: this.identifier.toString(),
            softwareSystemIdentifier: this.softwareSystemIdentifier.toString(),
            deploymentGroups: this.deploymentGroups,
            relationships: this.relationships?.map((r) => r.toSnapshot()),
            description: this.description,
            tags: this.tags,
            url: this.url,
            // properties: this.properties,
            // perspectives: this.perspectives,
            // healthCheck: this.healthCheck
        };
    }
}
