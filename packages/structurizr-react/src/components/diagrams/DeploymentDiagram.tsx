import { DeploymentViewStrategy, IDeploymentView } from "@structurizr/dsl";
import { FC, PropsWithChildren, useEffect, useState } from "react";
import { IViewMetadata, ViewMetadataProvider } from "../../containers";
import { ViewElementJsxVisitor, ZoomCallback } from "../../types";
import { createDefaultDeploymentView } from "../../utils";
import { useWorkspace } from "./Workspace";

export const DeploymentDiagram: FC<PropsWithChildren<{
    value: IDeploymentView;
    metadata?: IViewMetadata;
    onZoomInClick?: ZoomCallback;
    onZoomOutClick?: ZoomCallback;
}>> = ({
    children,
    value,
    metadata,
    onZoomInClick,
    onZoomOutClick,
}) => {
        const { workspace } = useWorkspace();
        const [elements, setElements] = useState<JSX.Element[]>([]);

        useEffect(() => {
            if (workspace) {
                const visitor = new ViewElementJsxVisitor(onZoomInClick, onZoomOutClick);
                const deploymentView = workspace.views.deployments.find(x => x.key === value.key)
                    ?? createDefaultDeploymentView();
                const strategy = new DeploymentViewStrategy(workspace.model, deploymentView);
                const elements = strategy.accept(visitor);
                setElements(elements);
            }
        }, [workspace, value.key, value.softwareSystemIdentifier, value.environment, onZoomInClick, onZoomOutClick]);

        return (
            <ViewMetadataProvider metadata={metadata}>
                {elements}
                {children}
            </ViewMetadataProvider>
        );
    };
