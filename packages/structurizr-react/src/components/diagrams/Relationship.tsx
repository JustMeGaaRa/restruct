import { FC, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Edge, MarkerType, Text } from "@graph/svg";
import { useViewMetadata } from "../../containers";
import { useThemeResolvedRelationshipStyle } from "../../hooks";

export interface IRelationship {
    identifier: string;
    sourceIdentifier: string;
    targetIdentifier: string;
    description?: string;
    tags?: { name: string }[];
}

export const Relationship: FC<{ value: IRelationship }> = ({ value }) => {
    const { metadata } = useViewMetadata();
    const [portalNode, setPortalNode] = useState<Element | null>(null);

    useEffect(() => {
        setPortalNode(
            document.getElementsByClassName("graph__viewport-content").item(0)
        );
    }, []);

    const tags =
        value.tags && value.tags.length > 0
            ? value.tags.map((t) => t.name)
            : ["Relationship"];
    const resolvedStyle = useThemeResolvedRelationshipStyle(tags);

    const color = resolvedStyle.color ?? "#E8E8E8";
    const thickness = resolvedStyle.thickness ?? 2;

    return (
        portalNode &&
        createPortal(
            <Edge
                id={value.identifier}
                sourceNodeId={value.sourceIdentifier}
                targetNodeId={value.targetIdentifier}
                points={metadata?.relationships?.[value.identifier]}
                markerStart={MarkerType.CircleOutline}
                markerEnd={MarkerType.ArrowClosed}
                strokeWidth={thickness}
            >
                <Text
                    fill={color}
                    fontSize={12}
                    fontFamily={"Inter"}
                    textAnchor={"middle"}
                    width={200}
                >
                    {value.description}
                </Text>
            </Edge>,
            portalNode
        )
    );
};
