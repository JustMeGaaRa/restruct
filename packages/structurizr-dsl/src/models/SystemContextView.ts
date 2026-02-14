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
        this.softwareSystemIdentifier = Identifier.parse(
            values.softwareSystemIdentifier
        );
        this.key = values.key;
        this.description = values.description;
        this.include = values.include?.map((x) => Identifier.parse(x)) ?? [];
        this.exclude = values.exclude?.map((x) => Identifier.parse(x)) ?? [];
        this.autoLayout = values.autoLayout
            ? new AutoLayout(values.autoLayout)
            : new AutoLayout();
        this.animation = values.animation;
        this.title = values.title;
        // this.properties = values.properties;
    }

    public type: ViewType.SystemContext;
    public softwareSystemIdentifier: Identifier;
    public key?: string;
    public include: Array<Identifier | All>;
    public exclude: Array<Identifier>;
    public autoLayout?: AutoLayout;
    public animation?: unknown;
    public title?: string;
    public description?: string;
    // public properties?: Properties;

    public toSnapshot(): ISystemContextView {
        return {
            type: this.type,
            softwareSystemIdentifier: this.softwareSystemIdentifier.toString(),
            key: this.key,
            include: this.include.map((x) => x.toString()),
            exclude: this.exclude.map((x) => x.toString()),
            autoLayout: this.autoLayout?.toSnapshot(),
            animation: {},
            title: this.title,
            description: this.description,
            // properties: this.properties,
        };
    }
}
