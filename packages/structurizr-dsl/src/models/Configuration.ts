import { IBranding, IConfiguration, IStyles, Url } from "../interfaces";
import { ISupportSnapshot } from "../shared";
import { Terminology } from "./Terminology";

export class Configuration implements ISupportSnapshot<IConfiguration> {
    constructor(params: Partial<IConfiguration>) {
        this.styles = params.styles ?? {
            elements: [],
            relationships: [],
        };
        this.theme = params.theme;
        this.themes = params.themes ?? [];
        // this.branding = params.branding;
        // this.terminology = params.terminology;
    }

    public readonly styles: IStyles;
    public readonly theme?: Url;
    public readonly themes: Url[];
    public readonly branding?: IBranding;
    public readonly terminology?: Terminology;

    public toSnapshot(): IConfiguration {
        return {
            styles: this.styles,
            theme: this.theme,
            themes: this.themes,
            // branding: this.branding,
            // terminology: this.terminology
        };
    }
}
