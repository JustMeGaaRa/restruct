import {
    createWorkspaceExplorer,
    IComponent,
    IContainer,
    IPerson,
    ISoftwareSystem,
    IWorkspace,
    createDefaultWorkspace,
} from "@restruct/structurizr-dsl";
import {
    createContext,
    Dispatch,
    FC,
    PropsWithChildren,
    SetStateAction,
    useContext,
    useMemo,
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
    return (
        <WorkspaceContext.Provider
            value={{
                workspace,
                setWorkspace,
                renderElementOverlay,
            }}
        >
            {children}
        </WorkspaceContext.Provider>
    );
};

export const WorkspaceContext = createContext<{
    workspace: IWorkspace | null;
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
    setWorkspace: () => {
        console.debug("Workspace Context: dummy setWorkspace");
    },
});

export const useWorkspace = () => {
    const context = useContext(WorkspaceContext);

    const explorer = useMemo(() => {
        const workspace = context.workspace ?? createDefaultWorkspace();
        return createWorkspaceExplorer(workspace.model);
    }, [context.workspace]);

    return {
        ...context,
        ...explorer,
    };
};
