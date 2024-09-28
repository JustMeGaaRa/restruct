import { IWorkspace, Properties } from "../interfaces";
import { ISupportSnapshot } from "../shared";
import { Model } from "./Model";
import { Views } from "./Views";

export class Workspace implements ISupportSnapshot<IWorkspace> {
    constructor(params: IWorkspace) {
        this.version = params.version;
        this.name = params.name;
        this.description = params.description;
        this.lastModifiedDate =
            params.lastModifiedDate ?? new Date().toUTCString();
        // this.properties = new Properties(params.properties);
        this.model = new Model(params.model);
        this.views = new Views(params.views);
    }

    public readonly version: number;
    public readonly lastModifiedDate: string;
    public readonly name?: string;
    public readonly description?: string;
    public readonly properties?: Properties;
    public readonly model: Model;
    public readonly views: Views;

    public toSnapshot(): IWorkspace {
        return {
            version: this.version,
            name: this.name,
            description: this.description,
            lastModifiedDate: this.lastModifiedDate,
            properties: this.properties,
            model: this.model.toSnapshot(),
            views: this.views.toSnapshot(),
        };
    }
}
