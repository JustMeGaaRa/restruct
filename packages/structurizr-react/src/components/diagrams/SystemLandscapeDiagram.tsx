import {
    ISystemLandscapeDiagram,
    ISystemLandscapeView,
    SystemLandscapeDiagram as Diagram,
    isPerson,
    isSoftwareSystem
} from "@structurizr/dsl";
import { FC, PropsWithChildren, useEffect, useState } from "react";
import { IViewMetadata, ViewMetadataProvider } from "../../containers";
import { ZoomCallback } from "../../types";
import { createDefaultSystemLandscapeView } from "../../utils";
import { useWorkspace } from "./Workspace";
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
    metadata,
    onZoomInClick,
    onZoomOutClick,
}) => {
        const { workspace } = useWorkspace();
        const [diagram, setDiagram] = useState<ISystemLandscapeDiagram | null>(null);

        useEffect(() => {
            if (workspace) {
                const systemLandscapeView = [workspace.views.systemLandscape].find(x => x?.key === value?.key)
                    ?? createDefaultSystemLandscapeView();
                const builder = new Diagram(workspace, systemLandscapeView);
                setDiagram(builder.build());
            }
        }, [workspace, onZoomInClick, onZoomOutClick]);

        return (
            <ViewMetadataProvider metadata={metadata}>
                {diagram?.primaryElements.filter(isSoftwareSystem).map((element) => (
                    <SoftwareSystem key={element.identifier} value={element} />
                ))}
                {diagram?.primaryElements.filter(isPerson).map((element) => (
                    <Person key={element.identifier} value={element} />
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
