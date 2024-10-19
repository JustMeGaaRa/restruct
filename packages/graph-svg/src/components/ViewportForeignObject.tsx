import { FC, PropsWithChildren } from "react";

export const ViewportForeignObject: FC<PropsWithChildren<{
    position?: { x: number; y: number; };
    pointerEvents?: "none" | "auto";
    zIndex?: number;
}>> = ({
    children,
    position,
    pointerEvents = "none",
    zIndex = 0
}) => {
        return (
            <foreignObject
                className={"graph__viewport-object"}
                style={{
                    pointerEvents: pointerEvents,
                    position: "absolute",
                    transform: `translate(${position?.x ?? 0}, ${position?.y ?? 0})`,
                    zIndex: zIndex
                }}
            >
                {children}
            </foreignObject>
        )
    }