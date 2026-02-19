import {
    createDeploymentDiagram,
    IDeploymentDiagram,
    IDeploymentView,
    ViewType,
} from "@structurizr/dsl";
import { useViewport } from "@graph/svg";
import { FC, PropsWithChildren, useEffect, useState } from "react";
import {
    IViewMetadata,
    ViewMetadataProvider,
    useWorkspace,
} from "../../containers";
import { ZoomCallback } from "../../types";
import { autolayoutDiagram, createDefaultDeploymentView } from "../../utils";

export const DeploymentDiagram: FC<
    PropsWithChildren<{
        value: IDeploymentView;
        metadata?: IViewMetadata;
        onZoomInClick?: ZoomCallback;
        onZoomOutClick?: ZoomCallback;
    }>
> = ({ children, value, onZoomInClick, onZoomOutClick }) => {
    const { workspace } = useWorkspace();
    const { autofit, fitBounds, getBounds } = useViewport();
    const [diagram, setDiagram] = useState<IDeploymentDiagram | null>(null);
    const [metadata, setMetadata] = useState<IViewMetadata>({
        elements: {},
        relationships: {},
    });

    useEffect(() => {
        if (workspace) {
            const deploymentView =
                workspace.views.deployments.find((x) => x.key === value.key) ??
                createDefaultDeploymentView();

            const diagram = createDeploymentDiagram(workspace, deploymentView);
            setDiagram(diagram);

            autolayoutDiagram(diagram, ViewType.Deployment).then(setMetadata);
        }
    }, [
        workspace,
        value.key,
        value.softwareSystemIdentifier,
        value.environment,
        onZoomInClick,
        onZoomOutClick,
    ]);

    useEffect(() => {
        if (autofit) {
            fitBounds(getBounds());
        }
    }, [autofit, metadata, fitBounds, getBounds]);

    return (
        <ViewMetadataProvider metadata={metadata} setMetadata={setMetadata}>
            {children}
        </ViewMetadataProvider>
    );
};
