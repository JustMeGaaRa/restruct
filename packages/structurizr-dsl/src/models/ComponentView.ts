import { All, IComponentView, Identifier, ViewType } from "../interfaces";
import { ISupportSnapshot } from "../shared";
import { AutoLayout } from "./AutoLayout";

type ComponentViewProps = Required<
    Pick<IComponentView, "containerIdentifier">
> &
    Partial<Omit<IComponentView, "type">>;

export class ComponentView implements ISupportSnapshot<IComponentView> {
    constructor(values: ComponentViewProps) {
        this.type = ViewType.Component;
        this.containerIdentifier = Identifier.parse(values.containerIdentifier);
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

    public type: ViewType.Component;
    public containerIdentifier: Identifier;
    public key?: string;
    public include: Array<Identifier | All>;
    public exclude: Array<Identifier>;
    public autoLayout?: AutoLayout;
    public animation?: unknown;
    public title?: string;
    public description?: string;
    // public properties?: Properties;

    public toSnapshot(): IComponentView {
        return {
            type: this.type,
            containerIdentifier: this.containerIdentifier.toString(),
            key: this.key,
            include: this.include.map((x) => x.toString()),
            autoLayout: this.autoLayout?.toSnapshot(),
            animation: {},
            title: this.title,
            description: this.description,
            // properties: this.properties,
        };
    }
}
