import { FC } from "react";
import { BackgroundType } from "./BackgroundType";
import { BackgroundDotPattern } from "./BackgroundDotPattern";
import { useViewport } from "./ViewportProvider";

export const Background: FC<{
    fill?: string;
    variant?: BackgroundType;
}> = ({ fill = "#91919a" }) => {
    const { viewbox } = useViewport();

    return (
        <>
            <defs>
                <BackgroundDotPattern fill={fill} />
            </defs>
            <rect
                className={"structurizr__background"}
                fill={`url(#${BackgroundType.Dot})`}
                x={viewbox.x}
                y={viewbox.y}
                height={viewbox.height}
                width={viewbox.width}
            />
        </>
    );
};
