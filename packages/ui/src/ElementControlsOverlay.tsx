import {
    IElement,
    ElementType,
    View,
    isSoftwareSystem,
    isContainer,
    isSystemContextView,
    isContainerView,
    isComponentView,
    isSystemLandscapeView,
} from "@restruct/structurizr-dsl";
import { useViewNavigation } from "@restruct/structurizr-react";
import { ButtonGroup, IconButton } from "@chakra-ui/react";
import { LuZoomIn, LuZoomOut } from "react-icons/lu";
import { FC, useCallback } from "react";

// prettier-ignore
const checkZoomIntoAllowed = (
    targetElement: IElement,
    currentView?: View,
    isBoundary?: boolean
) =>
    !isBoundary &&
    ((isComponentView(currentView) && (isContainer(targetElement) || isSoftwareSystem(targetElement))) ||
        (isContainerView(currentView) && (isContainer(targetElement) || isSoftwareSystem(targetElement))) ||
        (isSystemContextView(currentView) && isSoftwareSystem(targetElement)) ||
        (isSystemLandscapeView(currentView) && isSoftwareSystem(targetElement)));

// prettier-ignore
const checkZoomOutOfAllowed = (
    targetElement: IElement,
    currentView?: View,
    isBoundary?: boolean
) =>
    isBoundary &&
    ((isComponentView(currentView) && isContainer(targetElement)) ||
        (isContainerView(currentView) && isSoftwareSystem(targetElement)));

export type ElementControlsOverlayProps = {
    element: IElement;
    state: {
        isHovered?: boolean;
        isSelected?: boolean;
        isBoundary?: boolean;
        isSecondary?: boolean;
    };
    onZoomIn?: () => void;
    onZoomOut?: () => void;
};

export const ElementControlsOverlay: FC<ElementControlsOverlayProps> = ({
    element,
    state,
    onZoomIn,
    onZoomOut,
}) => {
    const { currentView, zoomIntoElementScope, zoomOutToParentScope } =
        useViewNavigation();

    const handleZoomIn = useCallback(
        (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            if (isSoftwareSystem(element) || isContainer(element)) {
                e.stopPropagation();
                zoomIntoElementScope(element);
                onZoomIn?.();
            }
        },
        [element, zoomIntoElementScope, onZoomIn]
    );

    const handleZoomOut = useCallback(
        (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            e.stopPropagation();
            zoomOutToParentScope(element);
            onZoomOut?.();
        },
        [element, zoomOutToParentScope, onZoomOut]
    );

    if (!state.isHovered && !state.isSelected) return null;

    if (
        element.type === ElementType.Person ||
        element.type === ElementType.Component ||
        element.type === ElementType.Group
    ) {
        return null;
    }

    const allowZoomIn = checkZoomIntoAllowed(
        element,
        currentView,
        state.isBoundary
    );
    const allowZoomOut = checkZoomOutOfAllowed(
        element,
        currentView,
        state.isBoundary
    );

    return (
        <ButtonGroup
            position={"absolute"}
            top={state.isBoundary ? 6 : 2}
            right={2}
            gap={1}
            size={"xs"}
            colorPalette={"gray"}
            orientation={"vertical"}
            zIndex={100}
        >
            {allowZoomIn && (
                <IconButton
                    aria-label={"Zoom Into Scope"}
                    borderRadius={"lg"}
                    borderWidth={1}
                    borderColor="#535354"
                    title={"Zoom Into Scope"}
                    onClick={handleZoomIn}
                >
                    <LuZoomIn />
                </IconButton>
            )}
            {allowZoomOut && (
                <IconButton
                    aria-label={"Zoom Out of Scope"}
                    borderRadius={"lg"}
                    borderWidth={1}
                    borderColor="#535354"
                    title={"Zoom Out of Scope"}
                    onClick={handleZoomOut}
                >
                    <LuZoomOut />
                </IconButton>
            )}
        </ButtonGroup>
    );
};
