import { FC, PropsWithChildren } from "react";
import { cssCompose } from "../utils";
import { Box } from "./Box";

// TODO: make position, height and width required
export const Node: FC<PropsWithChildren<{
    id?: string;
    className?: string;
    position?: { x: number; y: number };
    height?: number;
    width?: number;
    backgroundColor?: string;
    borderColor?: string;
    borderWidth?: number;
    borderRadius?: number;
    padding?: number;
}>> = ({
    children,
    id,
    className,
    position = { x: 0, y: 0 },
    height = 200,
    width = 200,
    backgroundColor = "#222425",
    borderColor = "#535354",
    borderWidth = 2,
    borderRadius = 16,
    padding = 4,
}) => {
        return (
            <Box
                id={id}
                className={cssCompose("structurizr__node", className)}
                position={position}
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
