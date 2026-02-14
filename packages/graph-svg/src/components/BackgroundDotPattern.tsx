import { FC } from "react";
import { BackgroundType } from "./BackgroundType";
import { useViewport } from "./ViewportProvider";

export const BackgroundDotPattern: FC<{
    fill?: string;
}> = ({ fill = "#91919a" }) => {
    const { zoom } = useViewport();
    const multiplier = Math.pow(2, Math.floor(Math.log2(1 / zoom)));
    const size = 50 * multiplier;
    const radius = 1 * multiplier;

    return (
        <pattern
            id={BackgroundType.Dot}
            patternUnits="userSpaceOnUse"
            height={size}
            width={size}
        >
            <circle cx={radius} cy={radius} r={radius} fill={fill} />
        </pattern>
    );
};
