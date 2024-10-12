import { IWorkspace } from "@structurizr/dsl";
import {
    createContext,
    Dispatch,
    FC,
    PropsWithChildren,
    SetStateAction,
    useContext,
    useState
} from "react";

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
