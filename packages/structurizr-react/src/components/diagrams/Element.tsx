import { FC, PropsWithChildren } from "react";
import { Node, Text } from "@graph/svg";
import { useThemeResolvedElementStyle } from "../../hooks";

export interface IElement {
    type: string;
    identifier: string;
    name: string;
    description?: string;
    technology?: string[];
    tags?: { name: string }[];
}

// TODO: make position, height and width required
export const Element: FC<
    PropsWithChildren<{
        value: IElement;
        className?: string;
        position?: { x: number; y: number };
        height?: number;
        width?: number;
        borderWidth?: number;
        padding?: number;
    }>
> = ({
    children,
    value,
    className,
    position = { x: 0, y: 0 },
    height = 200,
    width = 200,
    borderWidth = 2,
    padding = 4,
}) => {
    // Determine tags. If value has tags, use them; otherwise, default to "Element" and the type.
    const tags =
        value.tags && value.tags.length > 0
            ? value.tags.map((t) => t.name)
            : ["Element", value.type];
    const resolvedStyle = useThemeResolvedElementStyle(tags);

    const backgroundColor = resolvedStyle.background ?? "#222425";
    const borderColor = resolvedStyle.stroke ?? "#535354";
    const resolvedBorderWidth = resolvedStyle.strokeWidth ?? borderWidth;
    const textColor = resolvedStyle.color ?? "#E8E8E8";
    const typeColor = "#A1A2A3"; // Typically derived or less prominent color
    const techColor = "#535354";

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
        </Node>
    );
};
