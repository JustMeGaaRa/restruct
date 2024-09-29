import { FC } from "react";

export const Cylinder: FC<{
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    height?: number;
    width?: number;
}> = ({
    fill,
    stroke,
    strokeWidth,
    height,
    width
}) => {
        return (
            <g>
                <path
                    d="M0,12  L 0,84 A 48 12 0 1 0 96 84 L 96,12 A 48 12 0 1 1 0 12 A 48 12 0 1 1 96 12 A 48 12 0 1 1 0 12 z"
                    fill={fill}
                    stroke-width={strokeWidth}
                    stroke={stroke}
                />
            </g>
        );
    };
