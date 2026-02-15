import { IDeploymentView } from "@structurizr/dsl";
import { FC, PropsWithChildren, useEffect } from "react";
import {
    IViewMetadata,
    ViewMetadataProvider,
    useWorkspace,
} from "../../containers";
import { ZoomCallback } from "../../types";

export const DeploymentDiagram: FC<
    PropsWithChildren<{
        value: IDeploymentView;
        metadata?: IViewMetadata;
        onZoomInClick?: ZoomCallback;
        onZoomOutClick?: ZoomCallback;
    }>
> = ({ children, value, metadata, onZoomInClick, onZoomOutClick }) => {
    const { workspace } = useWorkspace();

    useEffect(() => {
        if (workspace) {
            // const visitor = new ViewElementJsxVisitor(onZoomInClick, onZoomOutClick);
            // const deploymentView = workspace.views.deployments.find(x => x.key === value.key)
            //     ?? createDefaultDeploymentView();
            // const strategy = new DeploymentViewStrategy(workspace.model, deploymentView);
            // const elements = strategy.accept(visitor);
            // setElements(elements);
        }
    }, [
        workspace,
        value.key,
        value.softwareSystemIdentifier,
        value.environment,
        onZoomInClick,
        onZoomOutClick,
    ]);

    return (
        <ViewMetadataProvider metadata={metadata}>
            {children}
        </ViewMetadataProvider>
    );
};
