import { FC, PropsWithChildren, useState } from "react";
import { GroupNode, Text, ViewportForeignObject } from "@restruct/react-svg";
import { useWorkspace } from "../../containers";

export interface IBoundary {
    type: string;
    identifier: string;
    name: string;
}

export const Boundary: FC<
    PropsWithChildren<{
        value: IBoundary;
        className?: string;
        position: { x: number; y: number };
        height: number;
        width: number;
        borderWidth?: number;
        padding?: number;
    }>
> = ({
    children,
    value,
    className,
    position,
    height,
    width,
    borderWidth = 2,
    padding = 16,
}) => {
    const { renderElementOverlay } = useWorkspace();
    const [isHovered, setIsHovered] = useState(false);

    return (
        <GroupNode
            id={value.identifier}
            className={className}
            position={position}
            height={height}
            width={width}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
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
            {renderElementOverlay && (
                <ViewportForeignObject
                    position={{ x: 0, y: 0 }}
                    pointerEvents="auto"
                    zIndex={100}
                >
                    {renderElementOverlay(
                        value as any,
                        {
                            x: position.x,
                            y: position.y,
                            width: width,
                            height: height,
                        },
                        { isHovered, isBoundary: true }
                    )}
                </ViewportForeignObject>
            )}
        </GroupNode>
    );
};
