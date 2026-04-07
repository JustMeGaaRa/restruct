import {
    createDeploymentDiagram,
    IDeploymentDiagram,
    IDeploymentNode,
    IDeploymentView,
    ViewType,
    createDefaultDeploymentView,
    findOrDefault,
} from "@restruct/structurizr-dsl";
import { useViewport } from "@restruct/react-svg";
import { FC, PropsWithChildren, useEffect, useState } from "react";
import {
    IViewMetadata,
    ViewMetadataProvider,
    useWorkspace,
    useWorkspaceDiagram,
} from "../../containers";
import { ZoomCallback } from "../../types";
import { autolayoutDiagram } from "../../utils";
import { DeploymentNode } from "./DeploymentNode";
import { InfrastructureNode } from "./InfrastructureNode";
import { SoftwareSystemInstance } from "./SoftwareSystemInstance";
import { ContainerInstance } from "./ContainerInstance";
import { Relationship } from "./Relationship";

export const DeploymentDiagram: FC<
    PropsWithChildren<{
        value: IDeploymentView;
        metadata?: IViewMetadata;
        onZoomInClick?: ZoomCallback;
        onZoomOutClick?: ZoomCallback;
    }>
> = ({ children, value, onZoomInClick, onZoomOutClick }) => {
    const { workspace } = useWorkspace();
    const { diagrams: precalculatedDiagrams, metadata: precalculatedMetadata } =
        useWorkspaceDiagram();
    const { autofit, fitBounds, getBounds } = useViewport();

    const [diagram, setDiagram] = useState<IDeploymentDiagram | null>(null);
    const [metadata, setMetadata] = useState<IViewMetadata>({
        key: "",
        elements: {},
        relationships: {},
    });

    useEffect(() => {
        if (workspace) {
            const deploymentView = findOrDefault(
                workspace.views,
                value,
                createDefaultDeploymentView(
                    value.environment,
                    value.softwareSystemIdentifier
                )
            );

            const diagram = createDeploymentDiagram(workspace, deploymentView);
            setDiagram(diagram);

            autolayoutDiagram(diagram, ViewType.Deployment).then(setMetadata);
        }
    }, [workspace, value, onZoomInClick, onZoomOutClick]);

    useEffect(() => {
        if (autofit) {
            fitBounds(getBounds());
        }
    }, [autofit, metadata, fitBounds, getBounds]);

    const targetDiagram =
        (precalculatedDiagrams.get(value.key) as IDeploymentDiagram) ?? diagram;
    const targetMetadata = precalculatedMetadata.get(value.key) ?? metadata;

    return (
        <ViewMetadataProvider
            metadata={targetMetadata}
            setMetadata={setMetadata}
        >
            {targetDiagram?.scope &&
                targetDiagram?.scope.deploymentNodes.map((deploymentNode) => (
                    <DeploymentNodeRecursive
                        key={deploymentNode.identifier}
                        value={deploymentNode}
                    />
                ))}
            {targetDiagram?.relationships.map((relationship) => (
                <Relationship
                    key={relationship.identifier}
                    value={relationship}
                />
            ))}
            {children}
        </ViewMetadataProvider>
    );
};

const DeploymentNodeRecursive: FC<{ value: IDeploymentNode }> = ({ value }) => {
    return (
        <DeploymentNode value={value}>
            {value.infrastructureNodes.map((infrastructureNode) => (
                <InfrastructureNode
                    key={infrastructureNode.identifier}
                    value={infrastructureNode}
                />
            ))}
            {value.softwareSystemInstances.map((softwareSystemInstance) => (
                <SoftwareSystemInstance
                    key={softwareSystemInstance.identifier}
                    value={softwareSystemInstance}
                />
            ))}
            {value.containerInstances.map((container) => (
                <ContainerInstance
                    key={container.identifier}
                    value={container}
                />
            ))}
            {value.deploymentNodes.map((deploymentNode) => (
                <DeploymentNodeRecursive
                    key={deploymentNode.identifier}
                    value={deploymentNode}
                />
            ))}
        </DeploymentNode>
    );
};
