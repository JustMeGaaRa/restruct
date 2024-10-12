import {
    IComponentDiagram,
    IComponentView,
    createComponentDiagram,
    isComponent,
    isContainer,
    isPerson,
    isSoftwareSystem
} from "@structurizr/dsl";
import { FC, PropsWithChildren, useEffect, useState } from "react";
import { IViewMetadata, ViewMetadataProvider, useWorkspace } from "../../containers";
import { ZoomCallback } from "../../types";
import {
    createDefaultComponentView,
    getMetadataFromDiagram
} from "../../utils";
import { Container } from "./Container";
import { Component } from "./Component";
import { SoftwareSystem } from "./SoftwareSystem";
import { Person } from "./Person";
import { Relationship } from "./Relationship";

export const ComponentDiagram: FC<PropsWithChildren<{
    value: IComponentView;
    metadata?: IViewMetadata;
    onZoomInClick?: ZoomCallback;
    onZoomOutClick?: ZoomCallback;
}>> = ({
    children,
    value,
    onZoomInClick,
    onZoomOutClick,
}) => {
        const { workspace } = useWorkspace();
        const [diagram, setDiagram] = useState<IComponentDiagram | null>(null);
        const [metadata, setMetadata] = useState<IViewMetadata>({ elements: {}, relationships: {} });

        useEffect(() => {
            if (workspace) {
                const componentView = workspace.views.components.find(x => x.key === value.key)
                    ?? createDefaultComponentView(value.containerIdentifier);

                const diagram = createComponentDiagram(workspace, componentView);
                setDiagram(diagram);

                const metadataAuto = getMetadataFromDiagram(diagram);
                setMetadata(metadataAuto);
            }
        }, [workspace, value.key, value.containerIdentifier, onZoomInClick, onZoomOutClick]);

        return (
            <ViewMetadataProvider metadata={metadata} setMetadata={setMetadata}>
                {diagram?.scope && (
                    <Container
                        key={diagram.scope.identifier}
                        value={{
                            ...diagram.scope,
                            technology: diagram.scope.technology.join(", ")
                        }}
                    >
                        {diagram?.primaryElements.filter(isComponent).map((element) => (
                            <Component
                                key={element.identifier}
                                value={{
                                    ...element,
                                    technology: element.technology.join(", ")
                                }}
                            />
                        ))}
                    </Container>
                )}
                {diagram?.supportingElements.filter(isPerson).map((element) => (
                    <Person key={element.identifier} value={element} />
                ))}
                {diagram?.supportingElements.filter(isSoftwareSystem).map((element) => (
                    <SoftwareSystem key={element.identifier} value={element} />
                ))}
                {diagram?.supportingElements.filter(isContainer).map((element) => (
                    <Container
                        key={element.identifier}
                        value={{
                            ...element,
                            technology: element.technology.join(", ")
                        }}
                    />
                ))}
                {diagram?.relationships.map((relationship) => (
                    <Relationship key={relationship.identifier} value={relationship} />
                ))}
                {children}
            </ViewMetadataProvider>
        );
    };
