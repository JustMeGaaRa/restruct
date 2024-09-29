import { ISystemLandscapeDiagram, ISystemLandscapeView, SystemLandscapeDiagramBuilder } from "@structurizr/dsl";
import { FC, PropsWithChildren, useEffect, useState } from "react";
import { IViewMetadata, ViewMetadataProvider } from "../../containers";
import { ZoomCallback } from "../../types";
import { createDefaultSystemLandscapeView } from "../../utils";
import { useWorkspace } from "./Workspace";
import { SoftwareSystem } from "./SoftwareSystem";
import { Relationship } from "./Relationship";

export const SystemLandscapeDiagram: FC<PropsWithChildren<{
    value?: ISystemLandscapeView;
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
        const [diagram, setDiagram] = useState<ISystemLandscapeDiagram | null>(null);

        useEffect(() => {
            if (workspace) {
                const systemLandscapeView = workspace.views.systemLandscape
                    ?? createDefaultSystemLandscapeView();
                const builder = new SystemLandscapeDiagramBuilder(workspace, systemLandscapeView);
                setDiagram(builder.build());
            }
        }, [workspace, onZoomInClick, onZoomOutClick]);

        return (
            <ViewMetadataProvider metadata={metadata}>
                {diagram?.primaryElements.map((element) => (
                    <SoftwareSystem key={element.identifier} value={element} />
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
