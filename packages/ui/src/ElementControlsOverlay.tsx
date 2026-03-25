import { useViewNavigation } from "@restruct/structurizr-react";
import { ButtonGroup, IconButton } from "@chakra-ui/react";
import { LuZoomIn, LuZoomOut } from "react-icons/lu";
import { IElement, ElementType } from "@restruct/structurizr-dsl";

export const ElementControlsOverlay = ({
    element,
    state,
}: {
    element: IElement;
    state: {
        isHovered?: boolean;
        isSelected?: boolean;
        isBoundary?: boolean;
    };
}) => {
    const { zoomIntoElement, zoomOutOfElement } = useViewNavigation();
    if (!state.isHovered && !state.isSelected) return null;

    if (
        element.type === ElementType.Person ||
        element.type === ElementType.Component ||
        element.type === ElementType.Group
    ) {
        return null;
    }

    const isZoomOut = state.isBoundary;

    return (
        <ButtonGroup
            position="absolute"
            top={isZoomOut ? 6 : 2}
            right={2}
            borderRadius={"lg"}
            borderWidth={1}
            borderColor="#535354"
            gap={1}
            size={"xs"}
            colorPalette={"gray"}
            zIndex={100}
        >
            <IconButton
                aria-label={isZoomOut ? "Zoom Out" : "Zoom In"}
                borderRadius={"lg"}
                onClick={(e) => {
                    e.stopPropagation();
                    const zoomFunc = isZoomOut
                        ? zoomOutOfElement
                        : zoomIntoElement;
                    zoomFunc(element);
                }}
            >
                {isZoomOut ? <LuZoomOut /> : <LuZoomIn />}
            </IconButton>
        </ButtonGroup>
    );
};
