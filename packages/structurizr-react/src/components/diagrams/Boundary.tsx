import { FC, PropsWithChildren } from "react";
import { GroupNode, Text } from "../";

export interface IBoundary {
    type: string;
    identifier: string;
    name: string;
}

export const Boundary: FC<PropsWithChildren<{
    value: IBoundary;
    className?: string;
    position?: { x: number; y: number };
    height?: number;
    width?: number;
    borderWidth?: number;
    padding?: number;
}>> = ({
    children,
    value,
    className,
    position,
    height = 0,
    width = 0,
    borderWidth = 2,
    padding = 16,
}) => {
        return (
            <GroupNode
                id={value.identifier}
                className={className}
                position={position}
                height={height}
                width={width}
            >
                <Text
                    x={borderWidth + padding}
                    y={height - borderWidth - padding - 16}
                    fontSize={14}
                    fontFamily={"Inter"}
                    fill={"#E8E8E8"}
                    style={{ whiteSpace: "pre" }}
                    width={width - padding * 2 - borderWidth * 2}
                >
                    {value.name}
                </Text>
                <Text
                    x={borderWidth + padding}
                    y={height - borderWidth - padding}
                    fontSize={11}
                    fontFamily={"Inter"}
                    fill={"#A1A2A3"}
                    style={{ whiteSpace: "pre" }}
                    width={width - padding * 2 - borderWidth * 2}
                >
                    {value.type}
                </Text>
                {children}
            </GroupNode>
        );
    };
