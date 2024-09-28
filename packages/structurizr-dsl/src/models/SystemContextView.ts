import { All, ISystemContextView, Identifier, ViewType } from "../interfaces";
import { ISupportSnapshot } from "../shared";
import { AutoLayout } from "./AutoLayout";

type SystemContextViewProps = Required<
    Pick<ISystemContextView, "softwareSystemIdentifier">
> &
    Partial<Omit<ISystemContextView, "type">>;

export class SystemContextView implements ISupportSnapshot<ISystemContextView> {
    constructor(values: SystemContextViewProps) {
        this.type = ViewType.SystemContext;
        this.softwareSystemIdentifier = values.softwareSystemIdentifier;
        this.key = values.key;
        this.description = values.description;
        this.include = values.include ?? [];
        this.exclude = values.exclude ?? [];
        this.autoLayout = values.autoLayout
            ? new AutoLayout(values.autoLayout)
            : new AutoLayout();
        this.animation = values.animation;
        this.title = values.title;
        // this.properties = values.properties;
    }

    public type: ViewType.SystemContext;
    public softwareSystemIdentifier: string;
    public key?: string;
    public include: Array<Identifier | All>;
    public exclude: Array<Identifier>;
    public autoLayout?: AutoLayout;
    public animation?: any;
    public title?: string;
    public description?: string;
    // public properties?: Properties;

    public toSnapshot(): ISystemContextView {
        return {
            type: this.type,
            softwareSystemIdentifier: this.softwareSystemIdentifier,
            key: this.key,
            include: this.include,
            exclude: this.exclude,
            autoLayout: this.autoLayout?.toSnapshot(),
            animation: this.animation,
            title: this.title,
            description: this.description,
            // properties: this.properties,
        };
    }
}
