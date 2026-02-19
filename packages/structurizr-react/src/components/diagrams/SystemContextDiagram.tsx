import {
    ISystemContextDiagram,
    ISystemContextView,
    ViewType,
    createSystemContextDiagram,
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
import { createDefaultSystemContextView, autolayoutDiagram } from "../../utils";
import { SoftwareSystem } from "./SoftwareSystem";
import { Relationship } from "./Relationship";
import { Person } from "./Person";
import { useViewport } from "@graph/svg";

export const SystemContextDiagram: FC<
    PropsWithChildren<{
        value: ISystemContextView;
        metadata?: IViewMetadata;
        onZoomInClick?: ZoomCallback;
        onZoomOutClick?: ZoomCallback;
    }>
> = ({ children, value, onZoomInClick, onZoomOutClick }) => {
    const { workspace } = useWorkspace();
    const { autofit, fitBounds, getBounds } = useViewport();
    const [diagram, setDiagram] = useState<ISystemContextDiagram | null>(null);
    const [metadata, setMetadata] = useState<IViewMetadata>({
        elements: {},
        relationships: {},
    });

    useEffect(() => {
        if (workspace) {
            const systemContextView =
                workspace.views.systemContexts.find(
                    (x) => x.key === value.key
                ) ??
                createDefaultSystemContextView(value.softwareSystemIdentifier);

            const diagram = createSystemContextDiagram(
                workspace,
                systemContextView
            );
            setDiagram(diagram);

            autolayoutDiagram(diagram, ViewType.SystemContext).then(
                (metadataAuto) => setMetadata(metadataAuto)
            );
        }
    }, [
        workspace,
        value.key,
        value.softwareSystemIdentifier,
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
                <SoftwareSystem
                    key={diagram.scope.identifier}
                    value={diagram.scope}
                />
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
