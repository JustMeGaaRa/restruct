import { FC, PropsWithChildren } from "react";
import { useWorkspace } from "../containers";
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
        const { workspaceDomNode } = useWorkspace();
        const { domNode } = useBox();

        // TODO: consider passing these values as props for component reusability
        const workspacePosition = workspaceDomNode?.getBoundingClientRect()
            ?? { x: 0, y: 0 };
        const nodePosition = domNode?.current?.getBoundingClientRect()
            ?? { x: 0, y: 0 };
        const { x, y } = {
            x: nodePosition.x - workspacePosition.x,
            y: nodePosition.y - workspacePosition.y
        }

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