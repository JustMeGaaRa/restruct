import { ElementType, findContainerParent, findViewForElement, IElement, IWorkspace, View, ViewType } from "@structurizr/dsl";
import { createContext, Dispatch, FC, PropsWithChildren, SetStateAction, useCallback, useContext, useState } from "react";
import { createDefaultComponentView, createDefaultContainerView, createDefaultSystemContextView, createDefaultSystemLandscapeView } from "../utils";

export const ViewNavigationContext = createContext<{
    currentView: View | null;
    setCurrentView: Dispatch<SetStateAction<View | null>>;
}>({
    currentView: null,
    setCurrentView: () => { console.debug("WorkspaceNavigationContext: setCurrentView not implemented") },
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

    const openView = useCallback((workspace: IWorkspace, currentView: View) => {
        if (currentView === undefined) {
            const view = findViewForElement(workspace, ViewType.SystemLandscape, undefined)
                ?? createDefaultSystemLandscapeView();
            setCurrentView(view);
        }

        if (currentView?.type === ViewType.SystemLandscape) {
            const view = findViewForElement(workspace, ViewType.Container, undefined)
                ?? createDefaultSystemLandscapeView();
            setCurrentView(view);
        }

        if (currentView?.type === ViewType.SystemContext) {
            const view = findViewForElement(workspace, ViewType.Container, currentView.softwareSystemIdentifier)
                ?? createDefaultSystemContextView(currentView.softwareSystemIdentifier);
            setCurrentView(view);
        }

        if (currentView?.type === ViewType.Container) {
            const view = findViewForElement(workspace, ViewType.Container, currentView.softwareSystemIdentifier)
                ?? createDefaultContainerView(currentView.softwareSystemIdentifier);
            setCurrentView(view);
        }

        if (currentView?.type === ViewType.Component) {
            const view = findViewForElement(workspace, ViewType.Component, currentView.containerIdentifier)
                ?? createDefaultComponentView(currentView.containerIdentifier);
            setCurrentView(view);
        }
    }, [setCurrentView]);

    const zoomIntoElement = useCallback((workspace: IWorkspace, element: IElement) => {
        if (element === undefined) {
            const view = findViewForElement(workspace, ViewType.SystemLandscape, undefined)
                ?? createDefaultSystemLandscapeView();
            setCurrentView(view);
        }

        if (element?.type === ElementType.SoftwareSystem) {
            const view = findViewForElement(workspace, ViewType.Container, element.identifier.identifier)
                ?? createDefaultContainerView(element.identifier.identifier);
            setCurrentView(view);
        }

        if (element?.type === ElementType.Container) {
            const view = findViewForElement(workspace, ViewType.Component, element.identifier.identifier)
                ?? createDefaultComponentView(element.identifier.identifier);
            setCurrentView(view);
        }
    }, [setCurrentView]);

    const zoomOutOfElement = useCallback((workspace: IWorkspace, element: IElement) => {
        const parent = findContainerParent(workspace.model, element?.identifier.identifier);
        if (parent) {
            zoomIntoElement(workspace, parent as any);
        }
    }, [zoomIntoElement]);

    return {
        currentView,
        setCurrentView,
        zoomIntoElement,
        zoomOutOfElement,
    }
};
