import { FC, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Edge, MarkerType, Text } from "@restruct/react-svg";
import { ITag } from "@restruct/structurizr-dsl";
import { useViewMetadata } from "../../containers";
import { useThemeResolvedRelationshipStyle } from "../../hooks";

export interface IRelationship {
    identifier: string;
    sourceIdentifier: string;
    targetIdentifier: string;
    description?: string;
    tags?: ITag[];
}

export const Relationship: FC<{ value: IRelationship }> = ({ value }) => {
    const { metadata } = useViewMetadata();
    const [portalNode, setPortalNode] = useState<Element | null>(null);

    useEffect(() => {
        // TODO(viewport): use dom node from context provider
        setPortalNode(
            document.getElementsByClassName("graph__viewport-content").item(0)
        );
    }, []);

    const resolvedStyle = useThemeResolvedRelationshipStyle(value.tags);
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
