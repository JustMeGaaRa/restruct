import { FC, PropsWithChildren, useMemo } from "react";
import { Dimensions } from "../utils";
import { Box } from "./Box";
import { ConnectorId } from "./Connector";
import { MarkerType } from "./MarkerType";
import { MarkerCircleOutline } from "./MarkerCircleOutline";
import { MarkerArrowClosed } from "./MarkerArrowClosed";

function getPlacement(
    source: { x: number; y: number },
    target: { x: number; y: number }
) {
    return source.y > target.y ? "top-center" : "bottom-center";
}

function getConnectorCenter(placement: ConnectorId, node: Dimensions) {
    const x = node.absoluteX ?? node.x;
    const y = node.absoluteY ?? node.y;

    switch (placement) {
        case "top-left":
            return { x, y };
        case "top-center":
            return { x: x + node.width / 2, y };
        case "top-right":
            return { x: x + node.width, y };
        case "middle-left":
            return { x, y: y + node.height / 2 };
        case "middle-right":
            return { x: x + node.width, y: y + node.height / 2 };
        case "bottom-left":
            return { x, y: y + node.height };
        case "bottom-center":
            return { x: x + node.width / 2, y: y + node.height };
        case "bottom-right":
            return { x: x + node.width, y: y + node.height };
        default:
            return { x: x + node.width / 2, y: y + node.height / 2 };
    }
}

export const Edge: FC<
    PropsWithChildren<{
        id: string;
        sourceNodeId: string;
        targetNodeId: string;
        source: Dimensions;
        target: Dimensions;
        points?: Array<{ x: number; y: number }>;
        stroke?: string;
        strokeWidth?: number;
        markerStart?: MarkerType | string;
        markerEnd?: MarkerType | string;
    }>
> = ({
    children,
    id,
    source,
    target,
    points,
    stroke = "#535354",
    strokeWidth = 2,
    markerStart = MarkerType.CircleOutline,
    markerEnd = MarkerType.ArrowClosed,
}) => {
    const { path, labelCenter } = useMemo(() => {
        const sourceCenter = {
            x: (source.absoluteX ?? source.x) + source.width / 2,
            y: (source.absoluteY ?? source.y) + source.height / 2,
        };
        const targetCenter = {
            x: (target.absoluteX ?? target.x) + target.width / 2,
            y: (target.absoluteY ?? target.y) + target.height / 2,
        };

        const sourceConnectorPlacement = getPlacement(
            sourceCenter,
            targetCenter
        ) as ConnectorId;
        const targetConnectorPlacement = getPlacement(
            targetCenter,
            sourceCenter
        ) as ConnectorId;

        const sourceConnectorCenter = getConnectorCenter(
            sourceConnectorPlacement,
            source
        );
        const targetConnectorCenter = getConnectorCenter(
            targetConnectorPlacement,
            target
        );

        const labelCenter = {
            x: (sourceConnectorCenter.x + targetConnectorCenter.x) / 2,
            y: (sourceConnectorCenter.y + targetConnectorCenter.y) / 2,
        };

        const bendingPoints = points ?? [];
        const path = bendingPoints
            .concat(targetConnectorCenter)
            .reduce(
                (path, point) => `${path} ${point.x},${point.y}`,
                `${sourceConnectorCenter.x},${sourceConnectorCenter.y}`
            );

        return { path, labelCenter };
    }, [source, target, points]);

    return (
        <Box id={id} className={"graph__edge"}>
            <defs>
                <MarkerArrowClosed />
                <MarkerCircleOutline />
            </defs>
            <polyline
                stroke={stroke}
                strokeWidth={strokeWidth}
                fill={"none"}
                points={path}
                markerStart={`url(#${markerStart})`}
                markerEnd={`url(#${markerEnd})`}
            />
            <Box className={"graph__edge-label"} position={labelCenter}>
                {children}
            </Box>
        </Box>
    );
};
