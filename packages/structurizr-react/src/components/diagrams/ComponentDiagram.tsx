import {
    IComponentDiagram,
    IComponentView,
    ViewType,
    createComponentDiagram,
    createDefaultComponentView,
    findOrDefault,
    isComponent,
    isContainer,
    isPerson,
    isSoftwareSystem,
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
import { Container } from "./Container";
import { Component } from "./Component";
import { SoftwareSystem } from "./SoftwareSystem";
import { Person } from "./Person";
import { Relationship } from "./Relationship";
import { Group } from "./Group";

export const ComponentDiagram: FC<
    PropsWithChildren<{
        value: IComponentView;
        metadata?: IViewMetadata;
        onZoomInClick?: ZoomCallback;
        onZoomOutClick?: ZoomCallback;
    }>
> = ({ children, value, onZoomInClick, onZoomOutClick }) => {
    const { workspace } = useWorkspace();
    const { diagrams: precalculatedDiagrams, metadata: precalculatedMetadata } =
        useWorkspaceDiagram();
    const { autofit, fitBounds, getBounds } = useViewport();

    const [diagram, setDiagram] = useState<IComponentDiagram | null>(null);
    const [metadata, setMetadata] = useState<IViewMetadata>({
        key: "",
        elements: {},
        relationships: {},
    });

    useEffect(() => {
        if (workspace) {
            const componentView = findOrDefault(
                workspace,
                value,
                createDefaultComponentView(value.containerIdentifier)
            );

            const diagram = createComponentDiagram(workspace, componentView);
            setDiagram(diagram);

            autolayoutDiagram(diagram, ViewType.Component).then(setMetadata);
        }
    }, [workspace, value, onZoomInClick, onZoomOutClick]);

    useEffect(() => {
        if (autofit) {
            fitBounds(getBounds());
        }
    }, [autofit, metadata, fitBounds, getBounds]);

    const targetDiagram =
        (precalculatedDiagrams.get(value.key) as IComponentDiagram) ?? diagram;
    const targetMetadata = precalculatedMetadata.get(value.key) ?? metadata;

    return (
        <ViewMetadataProvider
            metadata={targetMetadata}
            setMetadata={setMetadata}
        >
            {targetDiagram?.scope && (
                <Container
                    key={targetDiagram.scope.identifier}
                    value={targetDiagram.scope}
                    isScope
                >
                    {targetDiagram?.scope.groups.map((group) => (
                        <Group key={group.identifier} value={group}>
                            {group.components.map((element) => (
                                <Component
                                    key={element.identifier}
                                    value={element}
                                />
                            ))}
                        </Group>
                    ))}
                    {targetDiagram?.scope.components
                        .filter(isComponent)
                        .map((element) => (
                            <Component
                                key={element.identifier}
                                value={element}
                            />
                        ))}
                </Container>
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
            {targetDiagram?.supportingElements
                .filter(isContainer)
                .map((element) => (
                    <Container key={element.identifier} value={element} />
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
