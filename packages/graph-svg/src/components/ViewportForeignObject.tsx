import { FC, PropsWithChildren } from "react";
import { useBox } from "./Box";

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
        const { domNode } = useBox();

        const nodePosition = domNode?.current?.getBoundingClientRect()
            ?? { x: 0, y: 0 };
        const { x, y } = nodePosition;

        return (
            <div
                className={"structurizr__viewport-object"}
                style={{
                    pointerEvents: pointerEvents,
                    position: "absolute",
                    transform: `translate(${x}px, ${y}px)`,
                    zIndex: zIndex
                }}
            >
                {children}
            </div>
        )
    }