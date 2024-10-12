import { FC, PropsWithChildren, useEffect, useRef } from "react";
import { useWorkspace } from "../../containers";

export const Workspace: FC<PropsWithChildren> = ({ children }) => {
    const ref = useRef<HTMLDivElement | null>(null);
    const { setWorkspaceDomNode } = useWorkspace();

    useEffect(() => setWorkspaceDomNode(ref.current), [ref, setWorkspaceDomNode]);

    return (
        <div
            ref={ref}
            className={"structurizr__workspace"}
            style={{
                position: "relative",
                margin: "0px",
                padding: "0px",
                height: "100%",
                width: "100%",
                overflow: "hidden",
            }}
        >
            {children}
        </div>
    );
};