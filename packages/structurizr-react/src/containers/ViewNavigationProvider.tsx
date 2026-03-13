import {
    ElementType,
    findViewForElement,
    IElement,
    IModel,
    ISoftwareSystem,
    View,
    ViewType,
    createDefaultComponentView,
    createDefaultContainerView,
    createDefaultSystemContextView,
    createDefaultSystemLandscapeView,
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

export const ViewNavigationContext = createContext<{
    currentView: View | null;
    setCurrentView: Dispatch<SetStateAction<View | null>>;
}>({
    currentView: null,
    setCurrentView: () => {
        console.debug(
            "WorkspaceNavigationContext: setCurrentView not implemented"
        );
    },
});

export const ViewNavigationProvider: FC<PropsWithChildren> = ({ children }) => {
    const [currentView, setCurrentView] = useState<View | null>(null);

    return (
        <ViewNavigationContext.Provider value={{ currentView, setCurrentView }}>
            {children}
        </ViewNavigationContext.Provider>
    );
};

export const useViewNavigation = () => {
    const { currentView, setCurrentView } = useContext(ViewNavigationContext);
    const { workspace } = useWorkspace();

    const openView = useCallback(
        (currentView: View) => {
            if (!workspace) return;

            if (currentView === undefined) {
                const view =
                    findViewForElement(
                        workspace,
                        ViewType.SystemLandscape,
                        undefined
                    ) ?? createDefaultSystemLandscapeView();
                setCurrentView(view);
            }

            if (currentView?.type === ViewType.SystemLandscape) {
                const view =
                    findViewForElement(
                        workspace,
                        ViewType.SystemLandscape,
                        undefined
                    ) ?? createDefaultSystemLandscapeView();
                setCurrentView(view);
            }

            if (currentView?.type === ViewType.SystemContext) {
                const view =
                    findViewForElement(
                        workspace,
                        ViewType.SystemContext,
                        currentView.softwareSystemIdentifier
                    ) ??
                    createDefaultSystemContextView(
                        currentView.softwareSystemIdentifier
                    );
                setCurrentView(view);
            }

            if (currentView?.type === ViewType.Container) {
                const view =
                    findViewForElement(
                        workspace,
                        ViewType.Container,
                        currentView.softwareSystemIdentifier
                    ) ??
                    createDefaultContainerView(
                        currentView.softwareSystemIdentifier
                    );
                setCurrentView(view);
            }

            if (currentView?.type === ViewType.Component) {
                const view =
                    findViewForElement(
                        workspace,
                        ViewType.Component,
                        currentView.containerIdentifier
                    ) ??
                    createDefaultComponentView(currentView.containerIdentifier);
                setCurrentView(view);
            }
        },
        [setCurrentView]
    );

    const zoomIntoElement = useCallback(
        (element: IElement) => {
            if (!workspace) return;

            if (element === undefined) {
                const view =
                    findViewForElement(
                        workspace,
                        ViewType.SystemLandscape,
                        undefined
                    ) ?? createDefaultSystemLandscapeView();
                setCurrentView(view);
            }

            if (element?.type === ElementType.SoftwareSystem) {
                const view =
                    findViewForElement(
                        workspace,
                        ViewType.Container,
                        element.identifier
                    ) ?? createDefaultContainerView(element.identifier);
                setCurrentView(view);
            }

            if (element?.type === ElementType.Container) {
                const view =
                    findViewForElement(
                        workspace,
                        ViewType.Component,
                        element.identifier
                    ) ?? createDefaultComponentView(element.identifier);
                setCurrentView(view);
            }
        },
        [setCurrentView]
    );

    const zoomOutOfElement = useCallback(
        (element: IElement) => {
            if (!workspace) return;

            if (element?.type === ElementType.SoftwareSystem) {
                const view =
                    findViewForElement(
                        workspace,
                        ViewType.SystemLandscape,
                        undefined
                    ) ?? createDefaultSystemLandscapeView();
                setCurrentView(view);
                return;
            }

            const findContainerParent = (
                model: IModel,
                containerId: string
            ): ISoftwareSystem | undefined => {
                return model.softwareSystems
                    .concat(model.groups.flatMap((x) => x.softwareSystems))
                    .find((x) => {
                        const allContainers = [
                            ...x.containers,
                            ...x.groups.flatMap((g) => g.containers),
                        ];
                        return allContainers.some(
                            (c) => c.identifier === containerId
                        );
                    });
            };

            // TODO(navigation): use workspace explorer to find parent
            if (element?.type === ElementType.Container) {
                const parent = findContainerParent(
                    workspace.model,
                    element?.identifier
                );
                if (parent !== undefined) {
                    zoomIntoElement(parent as ISoftwareSystem);
                }
            }
        },
        [zoomIntoElement, workspace]
    );

    return {
        currentView,
        setCurrentView,
        zoomIntoElement,
        zoomOutOfElement,
    };
};
