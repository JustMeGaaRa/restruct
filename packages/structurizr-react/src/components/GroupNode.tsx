import { FC, PropsWithChildren } from "react";
import { cssCompose } from "../utils";
import { Box } from "./Box";

export const GroupNode: FC<PropsWithChildren<{
    id?: string;
    className?: string;
    position?: { x: number; y: number };
    height?: number;
    width?: number;
    backgroundColor?: string;
    borderColor?: string;
    borderDash?: boolean;
    borderWidth?: number;
    borderRadius?: number;
}>> = ({
    children,
    id,
    className,
    position = { x: 0, y: 0 },
    height = 400,
    width = 400,
    backgroundColor = "#161819",
    borderColor = "#535354",
    borderDash = true,
    borderWidth = 2,
    borderRadius = 32,
}) => {
        return (
            <Box
                id={id}
                className={cssCompose("structurizr__group-node", className)}
                position={position}
            >
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
    };
