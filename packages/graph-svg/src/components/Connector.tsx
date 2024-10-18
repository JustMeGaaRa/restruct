import { FC, useMemo } from "react";

export type ConnectorId =
    | "top-left"
    | "top-center"
    | "top-right"
    | "middle-left"
    | "middle-right"
    | "bottom-left"
    | "bottom-center"
    | "bottom-right";

export const Connector: FC<{
    placement: ConnectorId;
    height: number;
    width: number;
}> = ({
    placement,
    height,
    width
}) => {
        // TODO: make height and width as props, and current props use from provider
        const connectorHeight = 5;
        const connectorWidth = 5;

        const { x, y } = useMemo(() => {
            switch (placement) {
                case "top-left":
                    return { x: 0 - connectorWidth / 2, y: 0 - connectorHeight / 2 };
                case "top-center":
                    return { x: width / 2 - connectorWidth / 2, y: 0 - connectorHeight / 2 };
                case "top-right":
                    return { x: width - connectorWidth / 2, y: 0 - connectorHeight / 2 };
                case "middle-left":
                    return { x: 0 - connectorWidth / 2, y: height / 2 - connectorHeight / 2 };
                case "middle-right":
                    return { x: width - connectorWidth / 2, y: height / 2 - connectorHeight / 2 };
                case "bottom-left":
                    return { x: 0 - connectorWidth / 2, y: height - connectorHeight / 2 };
                case "bottom-center":
                    return { x: width / 2 - connectorWidth / 2, y: height - connectorHeight / 2 };
                case "bottom-right":
                    return { x: width - connectorWidth / 2, y: height - connectorHeight / 2 };
            }
        }, [placement, height, width]);

        return (
            <rect
                className={`structurizr__element-connector ${placement}`}
                x={x}
                y={y}
                height={connectorHeight}
                width={connectorWidth}
                fill={"none"}
            />
        )
    };
