import {
    IComponent,
    IContainer,
    IPerson,
    ISoftwareSystem,
    IWorkspace,
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
    }>
> = ({ children, workspace, setWorkspace }) => {
    const [workspaceDomNode, setWorkspaceDomNode] =
        useState<HTMLDivElement | null>(null);

    return (
        <WorkspaceContext.Provider
            value={{
                workspaceDomNode,
                workspace,
                setWorkspaceDomNode,
                setWorkspace,
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
    return useContext(WorkspaceContext);
};

export const useElementById = () => {
    const { workspace } = useWorkspace();

    const elementsById = useMemo(() => {
        const map = new Map<string, WorkspaceElement>();
        if (!workspace) return map;

        workspace.model.groups
            .flatMap((g) => g.softwareSystems)
            .concat(workspace.model.softwareSystems)
            .forEach((system) => {
                map.set(system.identifier, system);
                system.groups
                    ?.flatMap((g) => g.containers)
                    .concat(system.containers)
                    .forEach((container) => {
                        map.set(container.identifier, container);
                        container.groups
                            ?.flatMap((g) => g.components)
                            .concat(container.components)
                            .forEach((component) => {
                                map.set(component.identifier, component);
                            });
                    });
            });

        workspace.model.groups
            .flatMap((g) => g.people)
            .concat(workspace.model.people)
            .forEach((person) => {
                map.set(person.identifier, person);
            });

        return map;
    }, [workspace]);

    const getElementById = (id: string) => elementsById.get(id);

    const getSoftwareSystemById = (id: string) => {
        const element = getElementById(id);
        return element?.type === "Software System"
            ? (element as ISoftwareSystem)
            : undefined;
    };

    const getContainerById = (id: string) => {
        const element = getElementById(id);
        return element?.type === "Container"
            ? (element as IContainer)
            : undefined;
    };

    const getComponentById = (id: string) => {
        const element = getElementById(id);
        return element?.type === "Component"
            ? (element as IComponent)
            : undefined;
    };

    const getPersonById = (id: string) => {
        const element = getElementById(id);
        return element?.type === "Person" ? (element as IPerson) : undefined;
    };

    return {
        getElementById,
        getSoftwareSystemById,
        getContainerById,
        getComponentById,
        getPersonById,
    };
};
