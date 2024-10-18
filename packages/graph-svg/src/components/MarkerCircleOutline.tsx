import { FC } from "react";
import { MarkerType } from "./MarkerType";

export const MarkerCircleOutline: FC<{
    fill?: string;
    stroke?: string;
}> = ({
    fill = "#454647",
    stroke = "#8A8B8C"
}) => {
        // TODO: fix edge marker alignment
        return (
            <marker
                id={MarkerType.CircleOutline}
                markerHeight={"4.5"}
                markerWidth={"4.5"}
                refX={"9"}
                refY={"4.5"}
                viewBox={"0 0 9 9"}
                fill={"none"}
                orient={"auto"}
            >
                <circle
                    cx={"4.5"}
                    cy={"4.5"}
                    r={"3.5"}
                    fill={fill}
                    stroke={stroke}
                    strokeWidth={"2"}
                />
            </marker>
        )
    }