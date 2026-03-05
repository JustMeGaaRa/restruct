import { FC, PropsWithChildren, useLayoutEffect, useState } from "react";
import {
    getAbsoluteCenterOrDefault,
    getSvgGraphicsElementByClassName,
    getSvgGraphicsElementById,
} from "../utils";
import { Box } from "./Box";
import { ConnectorId } from "./Connector";
import { MarkerType } from "./MarkerType";
import { MarkerCircleOutline } from "./MarkerCircleOutline";
import { MarkerArrowClosed } from "./MarkerArrowClosed";

function getPlacement(
    source: { x: number; y: number },
    target: { x: number; y: number }
) {
    const horizontalDiff = Math.abs(source.x - target.x);
    const verticalDiff = Math.abs(source.y - target.y);

    // TODO(edge): edge shortest path should choose between vertical or horizontal
    const placement: ConnectorId =
        horizontalDiff > verticalDiff
            ? source.x > target.x
                ? "middle-left"
                : "middle-right"
            : source.y > target.y
              ? "top-center"
              : "bottom-center";

    return source.y > target.y ? "top-center" : "bottom-center";
}

export const Edge: FC<
    PropsWithChildren<{
        id: string;
        sourceNodeId: string;
        targetNodeId: string;
        points?: Array<{ x: number; y: number }>;
        stroke?: string;
        strokeWidth?: number;
        markerStart?: MarkerType | string;
        markerEnd?: MarkerType | string;
    }>
> = ({
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

        function recalculate() {
            const sourceCenter = getAbsoluteCenterOrDefault(
                sourceNode!,
                sourceNode!.getBBox()
            );
            const targetCenter = getAbsoluteCenterOrDefault(
                targetNode!,
                targetNode!.getBBox()
            );
            const sourceConnectorPlacement = getPlacement(
                sourceCenter,
                targetCenter
            );
            const targetConnectorPlacement = getPlacement(
                targetCenter,
                sourceCenter
            );
            const sourceConnector = getSvgGraphicsElementByClassName(
                sourceNode!,
                sourceConnectorPlacement
            );
            const targetConnector = getSvgGraphicsElementByClassName(
                targetNode!,
                targetConnectorPlacement
            );

            if (!sourceConnector || !targetConnector) return;

            const sourceConnectorCenter = getAbsoluteCenterOrDefault(
                sourceConnector,
                sourceConnector.getBBox()
            );
            const targetConnectorCenter = getAbsoluteCenterOrDefault(
                targetConnector,
                targetConnector.getBBox()
            );

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
        }

        recalculate();

        const observer = new MutationObserver(recalculate);
        const observerConfig = {
            attributes: true,
            attributeFilter: ["transform"],
        };
        observer.observe(sourceNode, observerConfig);
        observer.observe(targetNode, observerConfig);

        return () => observer.disconnect();
    }, [id, sourceNodeId, targetNodeId, points]);

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
