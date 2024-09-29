import { IWorkspace } from "@structurizr/dsl";
import { createContext, Dispatch, FC, PropsWithChildren, SetStateAction, useContext, useEffect, useRef, useState } from "react";

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
                height: "100vh",
                width: "100vw",
                overflow: "hidden",
            }}
        >
            {children}
        </div>
    );
};

export const WorkspaceProvider: FC<PropsWithChildren<{
    workspace: IWorkspace;
    setWorkspace: Dispatch<SetStateAction<IWorkspace>>;
}>> = ({
    children,
    workspace,
    setWorkspace
}) => {
        const [workspaceDomNode, setWorkspaceDomNode] = useState<HTMLDivElement | null>(null);

        return (
            <WorkspaceContext.Provider
                value={{
                    workspaceDomNode,
                    workspace,
                    setWorkspaceDomNode,
                    setWorkspace
                }}
            >
                {children}
            </WorkspaceContext.Provider>
        )
    };

export const WorkspaceContext = createContext<{
    workspaceDomNode: HTMLDivElement | null;
    workspace: IWorkspace | null;
    setWorkspaceDomNode: (domNode: HTMLDivElement | null) => void;
    setWorkspace: Dispatch<SetStateAction<IWorkspace>>;
}>({
    workspace: null,
    workspaceDomNode: null,
    setWorkspaceDomNode: () => { console.debug("Workspace Context: dummy setWorkspaceDomNode") },
    setWorkspace: () => { console.debug("Workspace Context: dummy setWorkspace") },
});

export const useWorkspace = () => {
    return useContext(WorkspaceContext);
};
