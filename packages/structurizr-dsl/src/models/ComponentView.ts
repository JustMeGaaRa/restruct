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
        this.containerIdentifier = values.containerIdentifier;
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

    public type: ViewType.Component;
    public containerIdentifier: string;
    public key?: string;
    public include: Array<Identifier | All>;
    public exclude: Array<Identifier>;
    public autoLayout?: AutoLayout;
    public animation?: any;
    public title?: string;
    public description?: string;
    // public properties?: Properties;

    public toSnapshot(): IComponentView {
        return {
            type: this.type,
            containerIdentifier: this.containerIdentifier,
            key: this.key,
            include: this.include,
            autoLayout: this.autoLayout?.toSnapshot(),
            animation: this.animation,
            title: this.title,
            description: this.description,
            // properties: this.properties,
        };
    }
}
