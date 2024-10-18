import {
    IContainerDiagram,
    IContainerView,
    createContainerDiagram,
    isContainer,
    isGroup,
    isPerson,
    isSoftwareSystem
} from "@structurizr/dsl";
import { FC, PropsWithChildren, useEffect, useState } from "react";
import { IViewMetadata, ViewMetadataProvider, useWorkspace } from "../../containers";
import { ZoomCallback } from "../../types";
import {
    createDefaultContainerView,
    getMetadataFromDiagram
} from "../../utils";
import { SoftwareSystem } from "./SoftwareSystem";
import { Container } from "./Container";
import { Relationship } from "./Relationship";
import { Person } from "./Person";
import { Group } from "./Group";

export const ContainerDiagram: FC<PropsWithChildren<{
    value: IContainerView;
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
        const [diagram, setDiagram] = useState<IContainerDiagram | null>(null);
        const [metadata, setMetadata] = useState<IViewMetadata>({ elements: {}, relationships: {} });

        useEffect(() => {
            if (workspace) {
                const containerView = workspace.views.containers.find(x => x.key === value.key)
                    ?? createDefaultContainerView(value.softwareSystemIdentifier);

                const diagram = createContainerDiagram(workspace, containerView);
                setDiagram(diagram);

                const metadataAuto = getMetadataFromDiagram(diagram);
                setMetadata(metadataAuto);
            }
        }, [workspace, value.key, value.softwareSystemIdentifier, onZoomInClick, onZoomOutClick]);

        return (
            <ViewMetadataProvider metadata={metadata} setMetadata={setMetadata}>
                {diagram?.scope && (
                    <SoftwareSystem
                        key={diagram.scope.identifier}
                        value={diagram.scope}
                    >
                        {diagram?.primaryElements.filter(isGroup).map((element) => (
                            <Group key={element.identifier} value={element}>
                                {element.containers.filter(isContainer).map((element) => (
                                    <Container
                                        key={element.identifier}
                                        value={{
                                            ...element,
                                            technology: element.technology.join(", ")
                                        }}
                                    />
                                ))}
                            </Group>
                        ))}
                        {diagram?.primaryElements.filter(isContainer).map((element) => (
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
                {diagram?.supportingElements.filter(isPerson).map((element) => (
                    <Person key={element.identifier} value={element} />
                ))}
                {diagram?.supportingElements.filter(isSoftwareSystem).map((element) => (
                    <SoftwareSystem key={element.identifier} value={element} />
                ))}
                {diagram?.relationships.map((relationship) => (
                    <Relationship key={relationship.identifier} value={relationship} />
                ))}
                {children}
            </ViewMetadataProvider>
        );
    };
