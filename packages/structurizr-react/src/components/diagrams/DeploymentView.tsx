import { DeploymentViewStrategy, IElement } from "@structurizr/dsl";
import { FC, PropsWithChildren, useEffect, useState } from "react";
import { IViewMetadata, ViewMetadataProvider } from "../../containers";
// import { ViewElementJsxVisitor } from "../../types";
import { useWorkspace } from "./Workspace";
import { createDefaultDeploymentView } from "../../utils";

export const DeploymentView: FC<PropsWithChildren<{
    value: { key?: string; softwareSystemIdentifier: string; environment: string };
    metadata?: IViewMetadata;
    onZoomInClick?: (event: React.MouseEvent<HTMLButtonElement>, element: IElement) => void;
    onZoomOutClick?: (event: React.MouseEvent<HTMLButtonElement>, element: IElement) => void;
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
                // const visitor = new ViewElementJsxVisitor(onZoomInClick, onZoomOutClick);
                // const deploymentView = workspace.views.deployments.find(x => x.key === value.key)
                //     ?? createDefaultDeploymentView();
                // const strategy = new DeploymentViewStrategy(workspace.model, deploymentView);
                // const elements = strategy.accept(visitor);
                // setElements(elements);
            }
        }, [workspace, value.key, value.softwareSystemIdentifier, value.environment, onZoomInClick, onZoomOutClick]);

        return (
            <ViewMetadataProvider metadata={metadata}>
                {elements}
                {children}
            </ViewMetadataProvider>
        );
    };
