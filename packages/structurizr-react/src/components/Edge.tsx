import { FC, PropsWithChildren, useEffect, useLayoutEffect, useState } from "react";
import { calculateCenterPosition, getSvgElementByClassName, getSvgElementById } from "../utils";
import { Box, useBox } from "./Box";
import { ConnectorId } from "./Connector";
import { MarkerType } from "./MarkerType";
import { useViewport } from "../containers";

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
        const { zoom, viewbox } = useViewport();
        const { getAbsolutePosition } = useBox();
        const [path, setPath] = useState<string>("");
        const [labelCenter, setLabelCenter] = useState({ x: 0, y: 0 });

        useLayoutEffect(() => {
            const absolutePosition = getAbsolutePosition();
            const bendingPoints = points ?? [];

            const sourceNode = getSvgElementById(sourceNodeId);
            const targetNode = getSvgElementById(targetNodeId);

            if (!sourceNode || !targetNode) return;

            const sourceCenter = calculateCenterPosition(viewbox, zoom, sourceNode);
            const targetCenter = calculateCenterPosition(viewbox, zoom, targetNode);
            const sourceConnectorPlacement = getPlacement(sourceCenter, targetCenter);
            const targetConnectorPlacement = getPlacement(targetCenter, sourceCenter);
            const sourceConnector = getSvgElementByClassName(sourceNode, sourceConnectorPlacement);
            const targetConnector = getSvgElementByClassName(targetNode, targetConnectorPlacement);

            if (!sourceConnector || !targetConnector) return;

            const sourceConnectorCenter = calculateCenterPosition(viewbox, zoom, sourceConnector);
            const targetConnectorCenter = calculateCenterPosition(viewbox, zoom, targetConnector);
            const sourcePoint = {
                x: sourceConnectorCenter.x - absolutePosition.x,
                y: sourceConnectorCenter.y - absolutePosition.y,
            };
            const targetPoint = {
                x: targetConnectorCenter.x - absolutePosition.x,
                y: targetConnectorCenter.y - absolutePosition.y,
            };

            const labelCenter = {
                x: (sourcePoint.x + targetPoint.x) / 2,
                y: (sourcePoint.y + targetPoint.y) / 2,
            };
            const path = bendingPoints
                .concat(targetPoint)
                .reduce(
                    (path, point) => `${path} ${point.x},${point.y}`,
                    `${sourcePoint.x},${sourcePoint.y}`
                );

            setPath(path);
            setLabelCenter(labelCenter);
        }, [getAbsolutePosition, id, sourceNodeId, targetNodeId, points, viewbox, zoom]);

        return (
            <Box id={id} className={"structurizr__edge"}>
                <polyline
                    stroke={stroke}
                    strokeWidth={strokeWidth}
                    fill={"none"}
                    points={path}
                    markerStart={`url(#${markerStart})`}
                    markerEnd={`url(#${markerEnd})`}
                />
                <Box
                    className={"structurizr__edge-label"}
                    position={labelCenter}
                >
                    {children}
                </Box>
            </Box>
        );
    };
