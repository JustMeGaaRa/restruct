import {
    IComponentDiagram,
    IComponentView,
    ViewType,
    createComponentDiagram,
    isComponent,
    isContainer,
    isPerson,
    isSoftwareSystem,
} from "@structurizr/dsl";
import { FC, PropsWithChildren, useEffect, useState } from "react";
import {
    IViewMetadata,
    ViewMetadataProvider,
    useWorkspace,
} from "../../containers";
import { ZoomCallback } from "../../types";
import { createDefaultComponentView, autolayoutDiagram } from "../../utils";
import { Container } from "./Container";
import { Component } from "./Component";
import { SoftwareSystem } from "./SoftwareSystem";
import { Person } from "./Person";
import { Relationship } from "./Relationship";
import { Group } from "./Group";
import { useViewport } from "@graph/svg";

export const ComponentDiagram: FC<
    PropsWithChildren<{
        value: IComponentView;
        metadata?: IViewMetadata;
        onZoomInClick?: ZoomCallback;
        onZoomOutClick?: ZoomCallback;
    }>
> = ({ children, value, onZoomInClick, onZoomOutClick }) => {
    const { workspace } = useWorkspace();
    const { autofit, fitBounds, getBounds } = useViewport();
    const [diagram, setDiagram] = useState<IComponentDiagram | null>(null);
    const [metadata, setMetadata] = useState<IViewMetadata>({
        elements: {},
        relationships: {},
    });

    useEffect(() => {
        if (workspace) {
            const componentView =
                workspace.views.components.find((x) => x.key === value.key) ??
                createDefaultComponentView(value.containerIdentifier);

            const diagram = createComponentDiagram(workspace, componentView);
            setDiagram(diagram);

            autolayoutDiagram(diagram, ViewType.Component).then(
                (metadataAuto) => setMetadata(metadataAuto)
            );
        }
    }, [
        workspace,
        value.key,
        value.containerIdentifier,
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
            {diagram?.scope && (
                <Container key={diagram.scope.identifier} value={diagram.scope}>
                    {diagram?.scope.groups.map((group) => (
                        <Group key={group.identifier} value={group}>
                            {group.components.map((element) => (
                                <Component
                                    key={element.identifier}
                                    value={element}
                                />
                            ))}
                        </Group>
                    ))}
                    {diagram?.scope.components
                        .filter(isComponent)
                        .map((element) => (
                            <Component
                                key={element.identifier}
                                value={element}
                            />
                        ))}
                </Container>
            )}
            {diagram?.supportingElements
                .filter(isPerson)
                .map((element) => (
                    <Person key={element.identifier} value={element} />
                ))}
            {diagram?.supportingElements
                .filter(isSoftwareSystem)
                .map((element) => (
                    <SoftwareSystem key={element.identifier} value={element} />
                ))}
            {diagram?.supportingElements
                .filter(isContainer)
                .map((element) => (
                    <Container key={element.identifier} value={element} />
                ))}
            {diagram?.relationships.map((relationship) => (
                <Relationship
                    key={relationship.identifier}
                    value={relationship}
                />
            ))}
            {children}
        </ViewMetadataProvider>
    );
};
