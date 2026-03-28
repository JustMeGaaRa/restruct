import { ITag } from "@restruct/structurizr-dsl";
import { Edge, MarkerType, Text } from "@restruct/react-svg";
import { FC } from "react";
import {
    useViewMetadata,
    useThemeResolvedRelationshipStyle,
} from "../../containers";

export interface IRelationship {
    identifier: string;
    sourceIdentifier: string;
    targetIdentifier: string;
    description?: string;
    technology?: string[];
    tags?: ITag[];
}

export const Relationship: FC<{ value: IRelationship }> = ({ value }) => {
    const { metadata } = useViewMetadata();

    const resolvedStyle = useThemeResolvedRelationshipStyle(value.tags);
    const color = resolvedStyle.color ?? "#E8E8E8";
    const thickness = resolvedStyle.thickness ?? 2;
    const sourceBbox = metadata?.elements?.[value.sourceIdentifier];
    const targetBbox = metadata?.elements?.[value.targetIdentifier];

    // TODO: resolve an issue with relationship rendering issue when nested
    // WARN: relationship is rendered incorrectly when nested because of absolute positioning
    return (
        sourceBbox &&
        targetBbox && (
            <Edge
                id={value.identifier}
                source={{
                    x: sourceBbox.x,
                    y: sourceBbox.y,
                    absoluteX: sourceBbox.absoluteX,
                    absoluteY: sourceBbox.absoluteY,
                    width: sourceBbox.width ?? 0,
                    height: sourceBbox.height ?? 0,
                }}
                target={{
                    x: targetBbox.x,
                    y: targetBbox.y,
                    absoluteX: targetBbox.absoluteX,
                    absoluteY: targetBbox.absoluteY,
                    width: targetBbox.width ?? 0,
                    height: targetBbox.height ?? 0,
                }}
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
                <Text
                    fill={color}
                    fontSize={8}
                    fontFamily={"Inter"}
                    textAnchor={"middle"}
                    width={200}
                    y={16}
                >
                    {value.technology?.join(" / ")}
                </Text>
            </Edge>
        )
    );
};
