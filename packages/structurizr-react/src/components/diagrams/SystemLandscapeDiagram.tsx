import {
    ISystemLandscapeDiagram,
    ISystemLandscapeView,
    createSystemLandscapeDiagram,
    isPerson,
    isSoftwareSystem
} from "@structurizr/dsl";
import { FC, PropsWithChildren, useEffect, useState } from "react";
import { IViewMetadata, ViewMetadataProvider, useWorkspace } from "../../containers";
import { ZoomCallback } from "../../types";
import {
    createDefaultSystemLandscapeView,
    getMetadataFromDiagram,
} from "../../utils";
import { SoftwareSystem } from "./SoftwareSystem";
import { Relationship } from "./Relationship";
import { Person } from "./Person";

export const SystemLandscapeDiagram: FC<PropsWithChildren<{
    value?: ISystemLandscapeView;
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
        const [diagram, setDiagram] = useState<ISystemLandscapeDiagram | null>(null);
        const [metadata, setMetadata] = useState<IViewMetadata>({ elements: {}, relationships: {} });

        useEffect(() => {
            if (workspace) {
                const systemLandscapeView = [workspace.views.systemLandscape].find(x => x?.key === value?.key)
                    ?? createDefaultSystemLandscapeView();

                const diagram = createSystemLandscapeDiagram(workspace, systemLandscapeView);
                setDiagram(diagram);

                const metadataAuto = getMetadataFromDiagram(diagram);
                setMetadata(metadataAuto);
            }
        }, [workspace, onZoomInClick, onZoomOutClick]);

        return (
            <ViewMetadataProvider metadata={metadata} setMetadata={setMetadata}>
                {diagram?.primaryElements.filter(isPerson).map((element) => (
                    <Person key={element.identifier} value={element} />
                ))}
                {diagram?.primaryElements.filter(isSoftwareSystem).map((element) => (
                    <SoftwareSystem key={element.identifier} value={element} />
                ))}
                {diagram?.relationships.map((relationship) => (
                    <Relationship key={relationship.identifier} value={relationship} />
                ))}
                {children}
            </ViewMetadataProvider>
        );
    };
