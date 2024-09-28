import { ISupportSnapshot } from "../shared";
import { IElementMetadata } from "./IElementMetadata";
import { IRelationshipMetadata } from "./IRelationshipMetadata";
import { IViewDefinitionMetadata } from "./IViewDefinitionMetadata";
import { IViewsMetadata } from "./IViewsMetadata";
import { IWorkspaceMetadata } from "./IWorkspaceMetadata";
import { Position } from "./Position";

export class ViewDefinitionMetadata
    implements ISupportSnapshot<IViewDefinitionMetadata>
{
    constructor(values: IViewDefinitionMetadata) {
        this.key = values.key;
        this.elements = values.elements ?? [];
        this.relationships = values.relationships ?? [];
    }

    public key?: string;
    public elements: Array<IElementMetadata>;
    public relationships: Array<IRelationshipMetadata>;

    public toSnapshot(): IViewDefinitionMetadata {
        return {
            key: this.key,
            elements: this.elements,
            relationships: this.relationships,
        };
    }

    public setElementPosition(elementId: string, position: Position) {
        this.elements = [
            ...this.elements.filter((x) => x.id !== elementId),
            { id: elementId, x: position.x, y: position.y },
        ];
    }

    public setRelationshipPosition(relationshipId: string) {
        this.relationships = [
            ...this.relationships.filter((x) => x.id !== relationshipId),
            { id: relationshipId, x: 0, y: 0 },
        ];
    }
}

export class ViewsMetadata implements ISupportSnapshot<IViewsMetadata> {
    constructor(values: IViewsMetadata) {
        this.systemLandscape = values.systemLandscape
            ? new ViewDefinitionMetadata(values.systemLandscape)
            : undefined;
        this.systemContexts =
            values.systemContexts?.map((x) => new ViewDefinitionMetadata(x)) ??
            [];
        this.containers =
            values.containers?.map((x) => new ViewDefinitionMetadata(x)) ?? [];
        this.components =
            values.components?.map((x) => new ViewDefinitionMetadata(x)) ?? [];
        this.deployments =
            values.deployments?.map((x) => new ViewDefinitionMetadata(x)) ?? [];
    }

    public readonly systemLandscape?: ViewDefinitionMetadata;
    public readonly systemContexts: Array<ViewDefinitionMetadata>;
    public readonly containers: Array<ViewDefinitionMetadata>;
    public readonly components: Array<ViewDefinitionMetadata>;
    public readonly deployments: Array<ViewDefinitionMetadata>;

    public toSnapshot(): IViewsMetadata {
        return {
            systemLandscape: this.systemLandscape?.toSnapshot(),
            systemContexts: this.systemContexts.map((x) => x.toSnapshot()),
            containers: this.containers.map((x) => x.toSnapshot()),
            components: this.components.map((x) => x.toSnapshot()),
            deployments: this.deployments.map((x) => x.toSnapshot()),
        };
    }
}

export class WorkspaceMetadata implements ISupportSnapshot<IWorkspaceMetadata> {
    constructor(values: IWorkspaceMetadata) {
        this.name = values.name;
        this.lastModifiedDate = values.lastModifiedDate;
        this.views = new ViewsMetadata(values.views);
    }

    public readonly name: string;
    public readonly lastModifiedDate: Date;
    public readonly views: ViewsMetadata;

    public static Empty = new WorkspaceMetadata({
        name: "",
        lastModifiedDate: new Date(),
        views: {
            systemLandscape: undefined,
            systemContexts: [],
            containers: [],
            components: [],
            deployments: [],
        },
    });

    public toSnapshot(): IWorkspaceMetadata {
        return {
            name: this.name,
            lastModifiedDate: this.lastModifiedDate,
            views: this.views.toSnapshot(),
        };
    }
}
