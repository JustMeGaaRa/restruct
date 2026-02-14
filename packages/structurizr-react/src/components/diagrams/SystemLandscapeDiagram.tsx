import {
    ISystemLandscapeDiagram,
    ISystemLandscapeView,
    ViewType,
    createSystemLandscapeDiagram,
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
import {
    createDefaultSystemLandscapeView,
    autolayoutDiagram,
} from "../../utils";
import { SoftwareSystem } from "./SoftwareSystem";
import { Relationship } from "./Relationship";
import { Person } from "./Person";
import { Group } from "./Group";

export const SystemLandscapeDiagram: FC<
    PropsWithChildren<{
        value?: ISystemLandscapeView;
        metadata?: IViewMetadata;
        onZoomInClick?: ZoomCallback;
        onZoomOutClick?: ZoomCallback;
    }>
> = ({ children, value, onZoomInClick, onZoomOutClick }) => {
    const { workspace } = useWorkspace();
    const [diagram, setDiagram] = useState<ISystemLandscapeDiagram | null>(
        null
    );
    const [metadata, setMetadata] = useState<IViewMetadata>({
        elements: {},
        relationships: {},
    });

    useEffect(() => {
        if (workspace) {
            const systemLandscapeView =
                [workspace.views.systemLandscape].find(
                    (x) => x?.key === value?.key
                ) ?? createDefaultSystemLandscapeView();

            const diagram = createSystemLandscapeDiagram(
                workspace,
                systemLandscapeView
            );
            setDiagram(diagram);

            const metadataAuto = autolayoutDiagram(
                diagram,
                ViewType.SystemLandscape
            );
            setMetadata(metadataAuto);
        }
    }, [workspace, onZoomInClick, onZoomOutClick, value?.key]);

    return (
        <ViewMetadataProvider metadata={metadata} setMetadata={setMetadata}>
            {diagram?.scope.groups.map((group) => (
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
            {diagram?.scope.people.map((element) => (
                <Person key={element.identifier} value={element} />
            ))}
            {diagram?.scope.softwareSystems.map((element) => (
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
