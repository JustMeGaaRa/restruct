import { FC, PropsWithChildren } from "react";
import { cssCompose } from "../utils";
import { Box } from "./Box";

const HOVER_PADDING = 36;

export const Node: FC<
    PropsWithChildren<{
        id?: string;
        className?: string;
        position: { x: number; y: number };
        height: number;
        width: number;
        backgroundColor?: string;
        borderColor?: string;
        borderWidth?: number;
        borderRadius?: number;
        padding?: number;
        onMouseEnter?: React.MouseEventHandler<SVGGraphicsElement>;
        onMouseLeave?: React.MouseEventHandler<SVGGraphicsElement>;
    }>
> = ({
    children,
    id,
    className,
    position,
    height,
    width,
    backgroundColor = "#222425",
    borderColor = "#535354",
    borderWidth = 2,
    borderRadius = 16,
    padding = 4,
    onMouseEnter,
    onMouseLeave,
}) => {
    return (
        <Box
            id={id}
            className={cssCompose("structurizr__node", className)}
            position={position}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <defs>
                <clipPath id="clip">
                    <rect
                        x={borderWidth + padding}
                        y={borderWidth + padding}
                        width={width - padding * 2}
                        height={height - padding * 2}
                        rx={borderRadius}
                        ry={borderRadius}
                    />
                </clipPath>
            </defs>
            <rect
                x={-HOVER_PADDING}
                y={-HOVER_PADDING}
                width={width + HOVER_PADDING * 2}
                height={height + HOVER_PADDING * 2}
                fill="transparent"
            />
            <rect
                cursor={"pointer"}
                height={height}
                width={width}
                fill={backgroundColor}
                stroke={borderColor}
                strokeWidth={borderWidth}
                rx={borderRadius}
                ry={borderRadius}
            />
            {children}
        </Box>
    );
};
