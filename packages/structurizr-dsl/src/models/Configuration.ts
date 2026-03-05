import { IBranding, IConfiguration, IStyles, Url } from "../interfaces";
import { ISupportSnapshot } from "../shared";
import { Terminology } from "./Terminology";

export class Configuration implements ISupportSnapshot<IConfiguration> {
    constructor(params: Partial<IConfiguration>) {
        this.styles = params.styles ?? {
            elements: [],
            relationships: [],
        };
        this.themes = params.themes ?? [];
        // this.branding = params.branding;
        // this.terminology = params.terminology;
    }

    public readonly styles: IStyles;
    public readonly themes: Url[];
    public readonly branding?: IBranding;
    public readonly terminology?: Terminology;

    public toSnapshot(): IConfiguration {
        return {
            styles: this.styles,
            themes: this.themes,
            // branding: this.branding,
            // terminology: this.terminology
        };
    }
}
