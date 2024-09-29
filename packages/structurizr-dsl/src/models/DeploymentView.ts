import { All, IDeploymentView, Identifier, ViewType } from "../interfaces";
import { ISupportSnapshot } from "../shared";
import { AutoLayout } from "./AutoLayout";

type DeploymentViewProps = Required<
    Pick<IDeploymentView, "softwareSystemIdentifier" | "environment">
> &
    Partial<Omit<IDeploymentView, "type">>;

export class DeploymentView implements ISupportSnapshot<IDeploymentView> {
    constructor(values: DeploymentViewProps) {
        this.type = ViewType.Deployment;
        this.softwareSystemIdentifier = values.softwareSystemIdentifier;
        this.environment = values.environment;
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

    public type: ViewType.Deployment;
    public softwareSystemIdentifier: string;
    public environment: string;
    public key?: string;
    public description?: string;
    public include: Array<Identifier | All>;
    public exclude: Array<Identifier>;
    public autoLayout?: AutoLayout;
    public animation?: any;
    public title?: string;
    // public properties?: Properties;

    public toSnapshot(): IDeploymentView {
        return {
            type: this.type,
            softwareSystemIdentifier: this.softwareSystemIdentifier,
            environment: this.environment,
            key: this.key,
            description: this.description,
            include: this.include,
            autoLayout: this.autoLayout?.toSnapshot(),
            animation: this.animation,
            title: this.title,
            // properties: this.properties,
        };
    }
}