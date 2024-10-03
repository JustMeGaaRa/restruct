import {
    IComponentView,
    IContainerView,
    IDeploymentView,
    IStyles,
    ISystemContextView,
    ISystemLandscapeView,
    IViews,
} from "../../interfaces";
import { BuilderCallback, IBuilder } from "../../shared";
import { ComponentView } from "../ComponentView";
import { ContainerView } from "../ContainerView";
import { DeploymentView } from "../DeploymentView";
import { SystemContextView } from "../SystemContextView";
import { SystemLandscapeView } from "../SystemLandscapeView";
import { StylesBuilder } from "./StylesBuilder";

export class ViewBuilder implements IBuilder<IViews> {
    private views: IViews;

    constructor() {
        this.views = {
            systemLandscape: undefined,
            systemContexts: [],
            containers: [],
            components: [],
            deployments: [],
            configuration: {
                styles: {
                    elements: [],
                    relationships: [],
                },
                themes: [],
            },
        };
    }

    systemLandscapeView(key: string): ISystemLandscapeView {
        this.views.systemLandscape = new SystemLandscapeView({
            key,
        }).toSnapshot();
        return this.views.systemLandscape;
    }

    systemContextView(
        softwareSystemIdentifier: string,
        key: string
    ): ISystemContextView {
        const systemContextView = new SystemContextView({
            softwareSystemIdentifier,
            key,
        }).toSnapshot();
        this.views.systemContexts.push(systemContextView);
        return systemContextView;
    }

    containerView(
        softwareSystemIdentifier: string,
        key: string
    ): IContainerView {
        const containerView = new ContainerView({
            softwareSystemIdentifier,
            key,
        }).toSnapshot();
        this.views.containers.push(containerView);
        return containerView;
    }

    componentView(containerIdentifier: string, key: string): IComponentView {
        const componentView = new ComponentView({
            containerIdentifier,
            key,
        }).toSnapshot();
        this.views.components.push(componentView);
        return componentView;
    }

    deploymentView(
        softwareSystemIdentifier: string,
        environment: string,
        key: string
    ): IDeploymentView {
        const deploymentView = new DeploymentView({
            softwareSystemIdentifier,
            environment,
            key,
        }).toSnapshot();
        this.views.deployments.push(deploymentView);
        return deploymentView;
    }

    styles(callback: BuilderCallback<StylesBuilder>): IStyles {
        const stylesBuilder = new StylesBuilder();
        callback(stylesBuilder);
        const styles = stylesBuilder.build();
        this.views.configuration.styles = styles;
        return styles;
    }

    build(): IViews {
        return this.views;
    }
}
