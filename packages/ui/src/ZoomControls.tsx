import { Box, VStack, IconButton, Tooltip, Portal } from "@chakra-ui/react";
import { useViewport } from "@graph/svg";
import { FiZoomIn, FiZoomOut, FiMaximize } from "react-icons/fi";
import React from "react";

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
        <Tooltip.Root>
            <Tooltip.Trigger asChild>
                <IconButton
                    aria-label={label}
                    onClick={onClick}
                    variant="ghost"
                    size="sm"
                    borderRadius="full"
                    color="white"
                    _hover={{
                        bg: "whiteAlpha.200",
                    }}
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

    const handleZoomIn = () => {
        zoomIn();
    };

    const handleZoomOut = () => {
        zoomOut();
    };

    const handleFitToScreen = () => {
        try {
            const bounds = getBounds();
            fitBounds(bounds);
        } catch (e) {
            console.error("Failed to fit bounds:", e);
        }
    };

    return (
        <Box position="fixed" bottom="4" right="4" zIndex={100}>
            <VStack
                gap={1}
                bg="rgba(20, 20, 20, 0.8)"
                backdropFilter="blur(12px)"
                borderRadius="full"
                p="1"
                border="1px solid"
                borderColor="whiteAlpha.200"
                boxShadow="0 4px 20px rgba(0, 0, 0, 0.4)"
            >
                <ZoomButton
                    label={`Zoom In (${Math.round(zoom * 100)}%)`}
                    icon={<FiZoomIn />}
                    onClick={handleZoomIn}
                />
                <ZoomButton
                    label="Zoom Out"
                    icon={<FiZoomOut />}
                    onClick={handleZoomOut}
                />
                <ZoomButton
                    label="Fit to Screen"
                    icon={<FiMaximize />}
                    onClick={handleFitToScreen}
                />
            </VStack>
        </Box>
    );
};
