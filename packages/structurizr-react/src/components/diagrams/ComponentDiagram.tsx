import {
    ComponentDiagramBuilder,
    IComponentDiagram,
    IComponentView,
    isContainer,
    isPerson,
    isSoftwareSystem
} from "@structurizr/dsl";
import { FC, PropsWithChildren, useEffect, useState } from "react";
import { IViewMetadata, ViewMetadataProvider } from "../../containers";
import { ZoomCallback } from "../../types";
import { createDefaultComponentView } from "../../utils";
import { useWorkspace } from "./Workspace";
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
    metadata,
    onZoomInClick,
    onZoomOutClick,
}) => {
        const { workspace } = useWorkspace();
        const [diagram, setDiagram] = useState<IComponentDiagram | null>(null);

        useEffect(() => {
            if (workspace) {
                const componentView = workspace.views.components.find(x => x.key === value.key)
                    ?? createDefaultComponentView(value.containerIdentifier);
                const builder = new ComponentDiagramBuilder(workspace, componentView);
                setDiagram(builder.build());
            }
        }, [workspace, value.key, value.containerIdentifier, onZoomInClick, onZoomOutClick]);

        return (
            <ViewMetadataProvider metadata={metadata}>
                {diagram?.scope && (
                    <Container
                        key={diagram.scope.identifier}
                        value={{
                            ...diagram.scope,
                            technology: diagram.scope.technology.join(", ")
                        }}
                    >
                        {diagram?.primaryElements.map((element) => (
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
                {diagram?.supportingElements.filter(isPerson).map((element) => (
                    <Person key={element.identifier} value={element} />
                ))}
                {diagram?.relationships.map((relationship) => (
                    <Relationship
                        key={`${relationship.sourceIdentifier}_${relationship.targetIdentifier}`}
                        value={{
                            identifier: `${relationship.sourceIdentifier}_${relationship.targetIdentifier}`,
                            ...relationship
                        }}
                    />
                ))}
                {children}
            </ViewMetadataProvider>
        );
    };
