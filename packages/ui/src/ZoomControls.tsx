import {
    Box,
    IconButton,
    Tooltip,
    Portal,
    ButtonGroup,
} from "@chakra-ui/react";
import { useViewport } from "@restruct/react-svg";
import { FiZoomIn, FiZoomOut, FiMaximize } from "react-icons/fi";
import React, { useCallback } from "react";

const ZoomButton = ({
    label,
    icon,
    onClick,
}: {
    label: string;
    icon: React.ReactNode;
    onClick: () => void;
}) => {
    return (
        <Tooltip.Root positioning={{ placement: "left" }}>
            <Tooltip.Trigger asChild>
                <IconButton
                    variant={"ghost"}
                    color={"gray.400"}
                    rounded={"full"}
                    onClick={onClick}
                    _hover={{ bg: "whiteAlpha.200", color: "white" }}
                >
                    {icon}
                </IconButton>
            </Tooltip.Trigger>
            <Portal>
                <Tooltip.Positioner>
                    <Tooltip.Content
                        bg="gray.800"
                        color="white"
                        px="2"
                        py="1"
                        borderRadius="md"
                        fontSize="xs"
                    >
                        {label}
                    </Tooltip.Content>
                </Tooltip.Positioner>
            </Portal>
        </Tooltip.Root>
    );
};

export const ZoomControls = () => {
    const { zoom, getBounds, fitBounds, zoomIn, zoomOut } = useViewport();

    const handleZoomIn = useCallback(() => zoomIn(), [zoomIn]);
    const handleZoomOut = useCallback(() => zoomOut(), [zoomOut]);
    const handleFitToScreen = useCallback(() => {
        try {
            const bounds = getBounds();
            fitBounds(bounds);
        } catch (e) {
            console.error("Failed to fit bounds:", e);
        }
    }, [getBounds, fitBounds]);

    return (
        <Box
            position="fixed"
            bottom="4"
            right="4"
            bg="rgba(20, 20, 20, 0.8)"
            backdropFilter="blur(12px)"
            borderRadius="full"
            p="1"
            border="1px solid"
            borderColor="whiteAlpha.200"
            boxShadow="0 4px 20px rgba(0, 0, 0, 0.4)"
            zIndex={1000}
        >
            <ButtonGroup orientation={"vertical"} size={"sm"}>
                <ZoomButton
                    label={`Zoom In (${Math.round(zoom * 100)}%)`}
                    icon={<FiZoomIn />}
                    onClick={handleZoomIn}
                />
                <ZoomButton
                    label={`Zoom Out (${Math.round(zoom * 100)}%)`}
                    icon={<FiZoomOut />}
                    onClick={handleZoomOut}
                />
                <ZoomButton
                    label="Fit to Screen"
                    icon={<FiMaximize />}
                    onClick={handleFitToScreen}
                />
            </ButtonGroup>
        </Box>
    );
};
