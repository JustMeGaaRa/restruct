import { ISupportSnapshot } from "../shared";
import { IWorkspaceMetadata } from "./IWorkspaceMetadata";
import { ViewsMetadata } from "./ViewsMetadata";

export class WorkspaceMetadata implements ISupportSnapshot<IWorkspaceMetadata> {
    constructor(values: IWorkspaceMetadata) {
        this.name = values.name;
        this.lastModifiedDate = values.lastModifiedDate;
        this.authors = values.authors;
        this.views = new ViewsMetadata(
            values.views ?? {
                systemLandscape: undefined,
                systemContexts: [],
                containers: [],
                components: [],
                deployments: [],
            }
        );
    }

    public readonly name: string;
    public readonly lastModifiedDate: Date;
    public readonly authors?: string[];
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
            authors: this.authors,
            views: this.views.toSnapshot(),
        };
    }
}
