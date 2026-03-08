/* eslint-disable react/display-name */
import { PropsWithChildren, forwardRef } from "react";
import { cssCompose } from "../utils";
import { Box } from "./Box";

const HOVER_PADDING = 36;

export const GroupNode = forwardRef<
    SVGGElement,
    PropsWithChildren<{
        id?: string;
        className?: string;
        position: { x: number; y: number };
        height: number;
        width: number;
        backgroundColor?: string;
        borderColor?: string;
        borderDash?: boolean;
        borderWidth?: number;
        borderRadius?: number;
        onMouseEnter?: React.MouseEventHandler<SVGGraphicsElement>;
        onMouseLeave?: React.MouseEventHandler<SVGGraphicsElement>;
    }>
>(
    (
        {
            children,
            id,
            className,
            position,
            height,
            width,
            backgroundColor = "#161819",
            borderColor = "#535354",
            borderDash = true,
            borderWidth = 2,
            borderRadius = 32,
            onMouseEnter,
            onMouseLeave,
        },
        ref
    ) => {
        return (
            <Box
                ref={ref}
                id={id}
                className={cssCompose("graph__group-node", className)}
                position={position}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
            >
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
                    strokeDasharray={borderDash ? "20 10" : undefined}
                    strokeWidth={borderWidth}
                    rx={borderRadius}
                    ry={borderRadius}
                />
                {children}
            </Box>
        );
    }
);
