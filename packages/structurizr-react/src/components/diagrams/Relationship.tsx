import { FC } from "react";
import { Edge, MarkerType, Text } from "../";
import { useViewMetadata } from "../../containers";

export interface IRelationship {
    identifier: string;
    sourceIdentifier: string;
    targetIdentifier: string;
    description?: string;
}

export const Relationship: FC<{ value: IRelationship }> = ({ value }) => {
    const { metadata } = useViewMetadata();

    // TODO: create a portal to the viewport so that edges are not scoped
    return (
        <Edge
            id={value.identifier}
            sourceNodeId={value.sourceIdentifier}
            targetNodeId={value.targetIdentifier}
            points={metadata?.relationships?.[value.identifier]}
            markerStart={MarkerType.CircleOutline}
            markerEnd={MarkerType.ArrowClosed}
        >
            <Text
                fill={"#E8E8E8"}
                fontSize={12}
                fontFamily={"Inter"}
                textAnchor={"middle"}
                width={200}
            >
                {value.description}
            </Text>
        </Edge>
    );
};
