import { All, IContainerView, Identifier, ViewType } from "../interfaces";
import { ISupportSnapshot } from "../shared";
import { AutoLayout } from "./AutoLayout";

type ContainerViewProps = Required<
    Pick<IContainerView, "softwareSystemIdentifier">
> &
    Partial<Omit<IContainerView, "type">>;

export class ContainerView implements ISupportSnapshot<IContainerView> {
    constructor(values: ContainerViewProps) {
        this.type = ViewType.Container;
        this.softwareSystemIdentifier = Identifier.parse(
            values.softwareSystemIdentifier
        );
        this.key = values.key;
        this.description = values.description;
        this.include = values.include?.map((i) => Identifier.parse(i)) ?? [];
        this.exclude = values.exclude?.map((i) => Identifier.parse(i)) ?? [];
        this.autoLayout = values.autoLayout
            ? new AutoLayout(values.autoLayout)
            : new AutoLayout();
        this.animation = values.animation;
        this.title = values.title;
        // this.properties = values.properties;
    }

    public type: ViewType.Container;
    public softwareSystemIdentifier: Identifier;
    public key?: string;
    public include: Array<Identifier | All>;
    public exclude: Array<Identifier>;
    public autoLayout?: AutoLayout;
    public animation?: unknown;
    public title?: string;
    public description?: string;
    // public properties?: Properties;

    public toSnapshot(): IContainerView {
        return {
            type: this.type,
            softwareSystemIdentifier: this.softwareSystemIdentifier.toString(),
            key: this.key,
            include: this.include.map((i) => i.toString()),
            autoLayout: this.autoLayout?.toSnapshot(),
            animation: {},
            title: this.title,
            description: this.description,
            // properties: this.properties,
        };
    }
}
