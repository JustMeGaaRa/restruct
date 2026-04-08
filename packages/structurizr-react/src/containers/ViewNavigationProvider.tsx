import {
    IElement,
    View,
    ISoftwareSystem,
    IContainer,
    IComponent,
    zoomOutToParentScope as zoomOutToParentScopeUtil,
    zoomIntoElementScope as zoomIntoElementScopeUtil,
    getViewPath,
} from "@restruct/structurizr-dsl";
import {
    createContext,
    Dispatch,
    FC,
    PropsWithChildren,
    SetStateAction,
    useCallback,
    useContext,
    useState,
} from "react";
import { useWorkspace } from "./WorkspaceProvider";

export type ViewPathItem = {
    index: number;
    element: IElement | undefined;
    view: View;
};

export type NavigationElement = ISoftwareSystem | IContainer | IComponent;

export const ViewNavigationContext = createContext<{
    currentView: View | undefined;
    path: Array<ViewPathItem>;
    setCurrentView: Dispatch<SetStateAction<View | undefined>>;
    setPath: Dispatch<SetStateAction<Array<ViewPathItem>>>;
}>({
    currentView: undefined,
    path: [],
    setCurrentView: () => {
        console.debug(
            "WorkspaceNavigationContext: setCurrentView not implemented"
        );
    },
    setPath: () => {
        console.debug("WorkspaceNavigationContext: setPath not implemented");
    },
});

export const ViewNavigationProvider: FC<
    PropsWithChildren<{
        initialView?: View | undefined;
    }>
> = ({ children, initialView }) => {
    const [currentView, setCurrentView] = useState(initialView);
    const [path, setPath] = useState<Array<ViewPathItem>>([]);

    return (
        <ViewNavigationContext.Provider
            value={{ currentView, path, setCurrentView, setPath }}
        >
            {children}
        </ViewNavigationContext.Provider>
    );
};

export const useViewNavigation = () => {
    const { currentView, path, setCurrentView, setPath } = useContext(
        ViewNavigationContext
    );
    const { workspace } = useWorkspace();

    const navigateToView = useCallback(
        (targetView: View | undefined) => {
            const path = getViewPath(workspace, targetView);
            setCurrentView(targetView);
            setPath(path);
        },
        [workspace, setCurrentView, setPath]
    );

    const navigateToPathSection = useCallback(
        (pathItem: ViewPathItem) => {
            setCurrentView(pathItem.view);
            setPath((path) => path.slice(0, pathItem.index + 1));
        },
        [setCurrentView, setPath]
    );

    const zoomIntoElementScope = useCallback(
        (targetScopeElement: ISoftwareSystem | IContainer) => {
            if (targetScopeElement === undefined) return;

            const path = zoomIntoElementScopeUtil(
                workspace,
                targetScopeElement
            );
            setPath(path);
            setCurrentView(path[path.length - 1]!.view);
        },
        [workspace, setCurrentView, setPath]
    );

    const zoomOutToParentScope = useCallback(
        (currentScopeElement: IElement | undefined) => {
            const path = zoomOutToParentScopeUtil(
                workspace,
                currentScopeElement
            );
            setPath(path);
            setCurrentView(path[path.length - 1]!.view);
        },
        [workspace, setCurrentView, setPath]
    );

    return {
        currentView,
        path,
        setCurrentView,
        navigateToView,
        navigateToPathSection,
        zoomIntoElementScope,
        zoomOutToParentScope,
    };
};
