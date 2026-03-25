import {
    ISystemContextDiagram,
    ISystemContextView,
    ViewType,
    createSystemContextDiagram,
    isPerson,
    isSoftwareSystem,
    createDefaultSystemContextView,
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
import { SoftwareSystem } from "./SoftwareSystem";
import { Relationship } from "./Relationship";
import { Person } from "./Person";

export const SystemContextDiagram: FC<
    PropsWithChildren<{
        value: ISystemContextView;
        metadata?: IViewMetadata;
        onZoomInClick?: ZoomCallback;
        onZoomOutClick?: ZoomCallback;
    }>
> = ({ children, value, onZoomInClick, onZoomOutClick }) => {
    const { workspace } = useWorkspace();
    const { diagrams: precalculatedDiagrams, metadata: precalculatedMetadata } =
        useWorkspaceDiagram();
    const { autofit, fitBounds, getBounds } = useViewport();

    const [diagram, setDiagram] = useState<ISystemContextDiagram | null>(null);
    const [metadata, setMetadata] = useState<IViewMetadata>({
        key: "",
        elements: {},
        relationships: {},
    });

    useEffect(() => {
        if (workspace) {
            const systemContextView = findOrDefault(
                workspace,
                value,
                createDefaultSystemContextView(value.softwareSystemIdentifier)
            );

            const diagram = createSystemContextDiagram(
                workspace,
                systemContextView
            );
            setDiagram(diagram);

            autolayoutDiagram(diagram, ViewType.SystemContext).then(
                setMetadata
            );
        }
    }, [workspace, value, onZoomInClick, onZoomOutClick]);

    useEffect(() => {
        if (autofit) {
            fitBounds(getBounds());
        }
    }, [autofit, metadata, fitBounds, getBounds]);

    const targetDiagram =
        (precalculatedDiagrams.get(value.key) as ISystemContextDiagram) ??
        diagram;
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
                />
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
