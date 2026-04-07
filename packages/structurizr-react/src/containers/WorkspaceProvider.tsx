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

export const WorkspaceContext = createContext<{
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
}>({
    workspace: createDefaultWorkspace(),
    setWorkspace: () => {
        console.debug("Workspace Context: dummy setWorkspace");
    },
});

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
                isSecondary?: boolean;
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

export const useWorkspace = () => {
    const context = useContext(WorkspaceContext);

    const explorer = useMemo(
        () => createWorkspaceExplorer(context.workspace),
        [context.workspace]
    );

    return {
        ...context,
        ...explorer,
    };
};
