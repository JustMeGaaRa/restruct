import {
    IContainerDiagram,
    IContainerView,
    ViewType,
    createContainerDiagram,
    isPerson,
    isSoftwareSystem,
    createDefaultContainerView,
    findViewOrDefault,
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
import { SoftwareSystem } from "./SoftwareSystem";
import { Container } from "./Container";
import { Relationship } from "./Relationship";
import { Person } from "./Person";
import { Group } from "./Group";

export const ContainerDiagram: FC<
    PropsWithChildren<{
        value: IContainerView;
        metadata?: IViewMetadata;
        onZoomInClick?: ZoomCallback;
        onZoomOutClick?: ZoomCallback;
    }>
> = ({ children, value, onZoomInClick, onZoomOutClick }) => {
    const { workspace } = useWorkspace();
    const { diagrams: precalculatedDiagrams, metadata: precalculatedMetadata } =
        useWorkspaceDiagram();
    const { autofit, fitBounds, getBounds } = useViewport();

    const [diagram, setDiagram] = useState<IContainerDiagram | null>(null);
    const [metadata, setMetadata] = useState<IViewMetadata>({
        key: "",
        elements: {},
        relationships: {},
    });

    useEffect(() => {
        if (workspace) {
            const containerView = findViewOrDefault(
                workspace.views,
                value,
                createDefaultContainerView(value.softwareSystemIdentifier)
            );

            const diagram = createContainerDiagram(workspace, containerView);
            setDiagram(diagram);

            autolayoutDiagram(diagram, ViewType.Container).then(setMetadata);
        }
    }, [workspace, value, onZoomInClick, onZoomOutClick]);

    useEffect(() => {
        if (autofit) {
            fitBounds(getBounds());
        }
    }, [autofit, metadata, fitBounds, getBounds]);

    const targetDiagram =
        (precalculatedDiagrams.get(value.key) as IContainerDiagram) ?? diagram;
    const targetMetadata = precalculatedMetadata.get(value.key) ?? metadata;

    return (
        <ViewMetadataProvider
            metadata={targetMetadata}
            setMetadata={setMetadata}
        >
            {targetDiagram?.scope && (
                <SoftwareSystem
                    key={targetDiagram.scope.identifier}
                    value={targetDiagram.scope}
                    isScope
                >
                    {targetDiagram?.scope.groups.map((group) => (
                        <Group key={group.identifier} value={group}>
                            {group.containers.map((element) => (
                                <Container
                                    key={element.identifier}
                                    value={element}
                                />
                            ))}
                        </Group>
                    ))}
                    {targetDiagram?.scope.containers.map((element) => (
                        <Container key={element.identifier} value={element} />
                    ))}
                </SoftwareSystem>
            )}
            {targetDiagram?.supportingElements
                .filter(isPerson)
                .map((element) => (
                    <Person key={element.identifier} value={element} />
                ))}
            {targetDiagram?.supportingElements
                .filter(isSoftwareSystem)
                .map((element) => (
                    <SoftwareSystem key={element.identifier} value={element} />
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
