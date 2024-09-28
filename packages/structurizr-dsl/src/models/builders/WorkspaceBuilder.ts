import { IModel, IViews, IWorkspace } from "../../interfaces";
import { BuilderCallback, IBuilder } from "../../shared";
import { ModelBuilder } from "./ModelBuilder";
import { ViewBuilder } from "./ViewBuilder";

export class WorkspaceBuilder implements IBuilder<IWorkspace> {
    private workspace: IWorkspace;

    constructor(name: string, description?: string) {
        this.workspace = {
            version: 1,
            lastModifiedDate: new Date().toUTCString(),
            name,
            description,
            model: {
                groups: [],
                people: [],
                softwareSystems: [],
                deploymentEnvironments: [],
                relationships: [],
            },
            views: {
                systemContexts: [],
                containers: [],
                components: [],
                deployments: [],
                configuration: {
                    styles: {
                        elements: [],
                        relationships: [],
                    },
                    themes: [],
                },
            },
        };
    }

    description(description: string): this {
        this.workspace.description = description;
        return this;
    }

    model(callback: BuilderCallback<ModelBuilder>): IModel {
        const modelBuilder = new ModelBuilder();
        callback(modelBuilder);
        const model = modelBuilder.build();
        this.workspace.model = model;
        return model;
    }

    views(callback: BuilderCallback<ViewBuilder>): IViews {
        const viewBuilder = new ViewBuilder();
        callback(viewBuilder);
        const views = viewBuilder.build();
        this.workspace.views = views;
        return views;
    }

    build(): IWorkspace {
        return this.workspace;
    }
}
