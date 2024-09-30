import {
    ContainerDiagramBuilder,
    IContainerDiagram,
    IContainerView,
    isPerson,
    isSoftwareSystem
} from "@structurizr/dsl";
import { FC, PropsWithChildren, useEffect, useState } from "react";
import { IViewMetadata, ViewMetadataProvider } from "../../containers";
import { ZoomCallback } from "../../types";
import { createDefaultContainerView } from "../../utils";
import { useWorkspace } from "./Workspace";
import { SoftwareSystem } from "./SoftwareSystem";
import { Container } from "./Container";
import { Relationship } from "./Relationship";
import { Person } from "./Person";

export const ContainerDiagram: FC<PropsWithChildren<{
    value: IContainerView;
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
        const [diagram, setDiagram] = useState<IContainerDiagram | null>(null);

        useEffect(() => {
            if (workspace) {
                const containerView = workspace.views.containers.find(x => x.key === value.key)
                    ?? createDefaultContainerView(value.softwareSystemIdentifier);
                const builder = new ContainerDiagramBuilder(workspace, containerView);
                setDiagram(builder.build());
            }
        }, [workspace, value.key, value.softwareSystemIdentifier, onZoomInClick, onZoomOutClick]);

        return (
            <ViewMetadataProvider metadata={metadata}>
                {diagram?.scope && (
                    <SoftwareSystem key={diagram.scope.identifier} value={diagram.scope}>
                        {diagram?.primaryElements.map((element) => (
                            <Container
                                key={element.identifier}
                                value={{
                                    ...element,
                                    technology: element.technology.join(", ")
                                }}
                            />
                        ))}
                    </SoftwareSystem>
                )}
                {diagram?.supportingElements.filter(isSoftwareSystem).map((element) => (
                    <SoftwareSystem key={element.identifier} value={element} />
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
