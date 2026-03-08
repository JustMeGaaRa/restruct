import {
    createWorkspaceExplorer,
    IComponent,
    IContainer,
    IPerson,
    ISoftwareSystem,
    IWorkspace,
    createDefaultWorkspace,
} from "@structurizr/dsl";
import {
    createContext,
    Dispatch,
    FC,
    PropsWithChildren,
    SetStateAction,
    useContext,
    useMemo,
    useState,
    ReactNode,
} from "react";

export type WorkspaceElement =
    | IPerson
    | ISoftwareSystem
    | IContainer
    | IComponent;

export const WorkspaceProvider: FC<
    PropsWithChildren<{
        workspace: IWorkspace;
        setWorkspace: Dispatch<SetStateAction<IWorkspace>>;
        renderElementOverlay?: (
            element: WorkspaceElement,
            dimensions: { x: number; y: number; width: number; height: number },
            state: {
                isHovered?: boolean;
                isSelected?: boolean;
                isBoundary?: boolean;
            }
        ) => ReactNode;
    }>
> = ({ children, workspace, setWorkspace, renderElementOverlay }) => {
    const [workspaceDomNode, setWorkspaceDomNode] =
        useState<HTMLDivElement | null>(null);

    return (
        <WorkspaceContext.Provider
            value={{
                workspaceDomNode,
                workspace,
                setWorkspaceDomNode,
                setWorkspace,
                renderElementOverlay,
            }}
        >
            {children}
        </WorkspaceContext.Provider>
    );
};

export const WorkspaceContext = createContext<{
    workspaceDomNode: HTMLDivElement | null;
    workspace: IWorkspace | null;
    setWorkspaceDomNode: (domNode: HTMLDivElement | null) => void;
    setWorkspace: Dispatch<SetStateAction<IWorkspace>>;
    renderElementOverlay?: (
        element: WorkspaceElement,
        dimensions: { x: number; y: number; width: number; height: number },
        state: {
            isHovered?: boolean;
            isSelected?: boolean;
            isBoundary?: boolean;
        }
    ) => ReactNode;
}>({
    workspace: null,
    workspaceDomNode: null,
    setWorkspaceDomNode: () => {
        console.debug("Workspace Context: dummy setWorkspaceDomNode");
    },
    setWorkspace: () => {
        console.debug("Workspace Context: dummy setWorkspace");
    },
});

export const useWorkspace = () => {
    const context = useContext(WorkspaceContext);
    const explorer = useMemo(() => {
        const workspace = context.workspace ?? createDefaultWorkspace();
        return createWorkspaceExplorer(workspace.model);
    }, [context.workspace?.model]);

    return {
        ...context,
        ...explorer,
    };
};
