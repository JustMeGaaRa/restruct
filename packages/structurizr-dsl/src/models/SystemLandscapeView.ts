import { All, ISystemLandscapeView, Identifier, ViewType } from "../interfaces";
import { ISupportSnapshot } from "../shared";
import { AutoLayout } from "./AutoLayout";

type SystemLandscapeViewProps = Partial<Omit<ISystemLandscapeView, "type">>;

export class SystemLandscapeView
    implements ISupportSnapshot<ISystemLandscapeView>
{
    constructor(values: SystemLandscapeViewProps) {
        this.type = ViewType.SystemLandscape;
        this.key = values.key;
        this.title = values.title;
        this.description = values.description;
        this.include = values.include?.map((x) => Identifier.parse(x)) ?? [];
        this.exclude = values.exclude?.map((x) => Identifier.parse(x)) ?? [];
        this.autoLayout = values.autoLayout
            ? new AutoLayout(values.autoLayout)
            : new AutoLayout();
        this.animation = values.animation;
        // this.properties = values.properties;
    }

    public type: ViewType.SystemLandscape;
    public key?: string;
    public description?: string;
    public include: Array<Identifier | All>;
    public exclude: Array<Identifier>;
    public autoLayout?: AutoLayout;
    public animation?: any;
    public title?: string;
    // public properties?: Properties;

    public toSnapshot(): ISystemLandscapeView {
        return {
            type: this.type,
            key: this.key,
            description: this.description,
            include: this.include.map((x) => x.toString()),
            autoLayout: this.autoLayout?.toSnapshot(),
            animation: this.animation,
            title: this.title,
            // properties: this.properties,
        };
    }
}
