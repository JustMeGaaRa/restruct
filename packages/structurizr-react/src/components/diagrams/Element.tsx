import { FC, PropsWithChildren, useState } from "react";
import { Node, Text, ViewportForeignObject } from "@restruct/react-svg";
import { ITag } from "@restruct/structurizr-dsl";
import { useThemeResolvedElementStyle } from "../../hooks";
import { useWorkspace } from "../../containers";

export interface IElement {
    type: string;
    identifier: string;
    name: string;
    description?: string;
    technology?: string[];
    tags?: ITag[];
}

export const Element: FC<
    PropsWithChildren<{
        value: IElement;
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
    padding = 4,
}) => {
    const resolvedStyle = useThemeResolvedElementStyle(value.tags);
    const backgroundColor = resolvedStyle.background ?? "#222425";
    const borderColor = resolvedStyle.stroke ?? "#535354";
    const resolvedBorderWidth = resolvedStyle.strokeWidth ?? borderWidth;
    const textColor = resolvedStyle.color ?? "#E8E8E8";
    const typeColor = "#A1A2A3";
    const techColor = "#535354";
    const { renderElementOverlay } = useWorkspace();
    const [isHovered, setIsHovered] = useState(false);

    return (
        <Node
            id={value.identifier}
            className={className}
            position={position}
            height={height}
            width={width}
            backgroundColor={backgroundColor}
            borderColor={borderColor}
            borderWidth={resolvedBorderWidth}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Text
                x={resolvedBorderWidth + width / 2}
                y={resolvedBorderWidth + padding + 20}
                fontSize={14}
                fontFamily={"Inter"}
                fill={textColor}
                clipPath={"url(#clip)"}
                style={{ whiteSpace: "pre" }}
                textAnchor={"middle"}
                width={width - padding * 2 - resolvedBorderWidth * 2}
            >
                {value.name}
            </Text>
            <Text
                x={resolvedBorderWidth + width / 2}
                y={resolvedBorderWidth + padding + 48}
                fontSize={11}
                fontFamily={"Inter"}
                fill={typeColor}
                clipPath={"url(#clip)"}
                style={{ whiteSpace: "pre" }}
                textAnchor={"middle"}
                width={width - padding * 2 - resolvedBorderWidth * 2}
            >
                {value.type}
            </Text>
            <Text
                x={resolvedBorderWidth + width / 2}
                y={resolvedBorderWidth + padding + 74}
                fontSize={12}
                fontFamily={"Inter"}
                fill={textColor}
                clipPath={"url(#clip)"}
                style={{ whiteSpace: "pre" }}
                textAnchor={"middle"}
                width={width - padding * 2 - resolvedBorderWidth * 2}
                noLines={6}
            >
                {value.description}
            </Text>
            <Text
                x={resolvedBorderWidth + width / 2}
                y={height - padding - 12}
                fontSize={12}
                fontFamily={"Inter"}
                fill={techColor}
                clipPath={"url(#clip)"}
                style={{ whiteSpace: "pre" }}
                textAnchor={"middle"}
                width={width - padding * 2 - resolvedBorderWidth * 2}
            >
                {value.technology?.join(", ")}
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
                            width,
                            height,
                        },
                        { isHovered }
                    )}
                </ViewportForeignObject>
            )}
        </Node>
    );
};
