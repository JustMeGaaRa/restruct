import {
    IElement,
    View,
    ViewType,
    ISoftwareSystem,
    IContainer,
    IComponent,
    zoomOutToParentScope as zoomOutToParentScopeUtil,
    zoomIntoElementScope as zoomIntoElementScopeUtil,
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
    const { workspace, getSoftwareSystemById, getContainerById } =
        useWorkspace();

    const navigateToView = useCallback(
        (targetView: View | undefined) => {
            if (targetView?.type === ViewType.SystemLandscape) {
                setCurrentView(targetView);
                setPath([]);
                return;
            }

            if (targetView?.type === ViewType.Deployment) {
                setCurrentView(targetView);
                setPath([
                    {
                        index: 0,
                        element: undefined,
                        view: targetView,
                    },
                ]);
                return;
            }

            if (targetView?.type === ViewType.Model) {
                setCurrentView(targetView);
                setPath([]);
                return;
            }

            const targetScopeElement =
                targetView?.type === ViewType.SystemContext
                    ? getSoftwareSystemById(targetView.softwareSystemIdentifier)
                    : targetView?.type === ViewType.Container
                      ? getSoftwareSystemById(
                            targetView.softwareSystemIdentifier
                        )
                      : targetView?.type === ViewType.Component
                        ? getContainerById(targetView.containerIdentifier)
                        : undefined;

            if (targetScopeElement !== undefined) {
                const path = zoomIntoElementScopeUtil(
                    workspace,
                    targetScopeElement
                );

                setPath(path);
                setCurrentView(path[path.length - 1]!.view);
            }
        },
        [
            workspace,
            getSoftwareSystemById,
            getContainerById,
            setCurrentView,
            setPath,
        ]
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
