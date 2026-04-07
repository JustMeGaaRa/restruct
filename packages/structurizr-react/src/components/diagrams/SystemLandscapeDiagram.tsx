import {
    ISystemLandscapeDiagram,
    ISystemLandscapeView,
    ViewType,
    createSystemLandscapeDiagram,
    isPerson,
    isSoftwareSystem,
    findOrDefault,
    createDefaultSystemLandscapeView,
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
import { Group } from "./Group";

export const SystemLandscapeDiagram: FC<
    PropsWithChildren<{
        value: ISystemLandscapeView;
        metadata?: IViewMetadata;
        onZoomInClick?: ZoomCallback;
        onZoomOutClick?: ZoomCallback;
    }>
> = ({ children, value, onZoomInClick, onZoomOutClick }) => {
    const { workspace } = useWorkspace();
    const { diagrams: precalculatedDiagrams, metadata: precalculatedMetadata } =
        useWorkspaceDiagram();
    const { autofit, fitBounds, getBounds } = useViewport();

    const [diagram, setDiagram] = useState<ISystemLandscapeDiagram | null>(
        null
    );
    const [metadata, setMetadata] = useState<IViewMetadata>({
        key: "",
        elements: {},
        relationships: {},
    });

    // TODO(diagram): consider using Suspese and use hook while building diagram to avoid UI flicker
    useEffect(() => {
        if (workspace) {
            const systemLandscapeView = findOrDefault(
                workspace.views,
                value,
                createDefaultSystemLandscapeView()
            );

            const diagram = createSystemLandscapeDiagram(
                workspace,
                systemLandscapeView
            );
            setDiagram(diagram);

            autolayoutDiagram(diagram, ViewType.SystemLandscape).then(
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
        (precalculatedDiagrams.get(value.key) as ISystemLandscapeDiagram) ??
        diagram;
    const targetMetadata = precalculatedMetadata.get(value.key) ?? metadata;

    return (
        <ViewMetadataProvider
            metadata={targetMetadata}
            setMetadata={setMetadata}
        >
            {targetDiagram?.scope.groups.map((group) => (
                <Group key={group.identifier} value={group}>
                    {group.people.filter(isPerson).map((element) => (
                        <Person key={element.identifier} value={element} />
                    ))}
                    {group.softwareSystems
                        .filter(isSoftwareSystem)
                        .map((element) => (
                            <SoftwareSystem
                                key={element.identifier}
                                value={element}
                            />
                        ))}
                </Group>
            ))}
            {targetDiagram?.scope.people.map((element) => (
                <Person key={element.identifier} value={element} />
            ))}
            {targetDiagram?.scope.softwareSystems.map((element) => (
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
