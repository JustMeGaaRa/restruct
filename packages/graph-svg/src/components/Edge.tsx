import { FC, PropsWithChildren, useLayoutEffect, useState } from "react";
import { getAbsoluteCenterOrDefault, getSvgGraphicsElementByClassName, getSvgGraphicsElementById } from "../utils";
import { Box } from "./Box";
import { ConnectorId } from "./Connector";
import { MarkerType } from "./MarkerType";

function getPlacement(
    source: { x: number; y: number },
    target: { x: number; y: number }
) {
    const horizontalDiff = Math.abs(source.x - target.x);
    const verticalDiff = Math.abs(source.y - target.y);

    // TODO: edge shortest path should choose between vertical or horizontal
    const placement: ConnectorId = horizontalDiff > verticalDiff
        ? (source.x > target.x ? "middle-left" : "middle-right")
        : (source.y > target.y ? "top-center" : "bottom-center");

    return source.y > target.y ? "top-center" : "bottom-center";
}

// TODO: don't use the default dimensions here as they are passed as parameters in other scope
const defaultDimensions = { x: 0, y: 0, height: 200, width: 200 };

export const Edge: FC<PropsWithChildren<{
    id: string;
    sourceNodeId: string;
    targetNodeId: string;
    points?: Array<{ x: number; y: number }>;
    stroke?: string;
    strokeWidth?: number;
    markerStart?: MarkerType | string;
    markerEnd?: MarkerType | string;
}>> = ({
    children,
    id: id,
    sourceNodeId,
    targetNodeId,
    points,
    stroke = "#535354",
    strokeWidth = 2,
    markerStart = MarkerType.CircleOutline,
    markerEnd = MarkerType.ArrowClosed,
}) => {
        const [path, setPath] = useState<string>("");
        const [labelCenter, setLabelCenter] = useState({ x: 0, y: 0 });

        useLayoutEffect(() => {
            const bendingPoints = points ?? [];

            const sourceNode = getSvgGraphicsElementById(sourceNodeId);
            const targetNode = getSvgGraphicsElementById(targetNodeId);

            if (!sourceNode || !targetNode) return;

            const sourceCenter = getAbsoluteCenterOrDefault(sourceNode, defaultDimensions);
            const targetCenter = getAbsoluteCenterOrDefault(targetNode, defaultDimensions);
            const sourceConnectorPlacement = getPlacement(sourceCenter, targetCenter);
            const targetConnectorPlacement = getPlacement(targetCenter, sourceCenter);
            const sourceConnector = getSvgGraphicsElementByClassName(sourceNode, sourceConnectorPlacement);
            const targetConnector = getSvgGraphicsElementByClassName(targetNode, targetConnectorPlacement);

            if (!sourceConnector || !targetConnector) return;

            const sourceConnectorCenter = getAbsoluteCenterOrDefault(sourceConnector, defaultDimensions);
            const targetConnectorCenter = getAbsoluteCenterOrDefault(targetConnector, defaultDimensions);

            const labelCenter = {
                x: (sourceConnectorCenter.x + targetConnectorCenter.x) / 2,
                y: (sourceConnectorCenter.y + targetConnectorCenter.y) / 2,
            };
            const path = bendingPoints
                .concat(targetConnectorCenter)
                .reduce(
                    (path, point) => `${path} ${point.x},${point.y}`,
                    `${sourceConnectorCenter.x},${sourceConnectorCenter.y}`
                );

            setPath(path);
            setLabelCenter(labelCenter);
        }, [id, sourceNodeId, targetNodeId, points]);

        return (
            <Box id={id} className={"graph__edge"}>
                <polyline
                    stroke={stroke}
                    strokeWidth={strokeWidth}
                    fill={"none"}
                    points={path}
                    markerStart={`url(#${markerStart})`}
                    markerEnd={`url(#${markerEnd})`}
                />
                <Box
                    className={"graph__edge-label"}
                    position={labelCenter}
                >
                    {children}
                </Box>
            </Box>
        );
    };
