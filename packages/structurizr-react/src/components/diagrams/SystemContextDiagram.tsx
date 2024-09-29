import { ISystemContextDiagram, ISystemContextView, SystemContextDiagramBuilder } from "@structurizr/dsl";
import { FC, PropsWithChildren, useEffect, useState } from "react";
import { IViewMetadata, ViewMetadataProvider } from "../../containers";
import { ZoomCallback } from "../../types";
import { createDefaultSystemContextView } from "../../utils";
import { useWorkspace } from "./Workspace";
import { SoftwareSystem } from "./SoftwareSystem";
import { Relationship } from "./Relationship";

export const SystemContextDiagram: FC<PropsWithChildren<{
    value: ISystemContextView;
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
        const [diagram, setDiagram] = useState<ISystemContextDiagram | null>(null);

        useEffect(() => {
            if (workspace) {
                const systemContextView = workspace.views.systemContexts.find(x => x.key === value.key)
                    ?? createDefaultSystemContextView(value.softwareSystemIdentifier);
                const builder = new SystemContextDiagramBuilder(workspace, systemContextView);
                setDiagram(builder.build());
            }
        }, [workspace, value.key, value.softwareSystemIdentifier, onZoomInClick, onZoomOutClick]);

        return (
            <ViewMetadataProvider metadata={metadata}>
                {diagram?.scope && (
                    <SoftwareSystem key={diagram.scope.identifier} value={diagram.scope} />
                )}
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