import { Box, HStack, Button, Text } from "@chakra-ui/react";

export type ViewMode = "diagrams" | "model" | "deployment";

interface ViewModeSwitcherProps {
    currentView: ViewMode;
    onChange: (view: ViewMode) => void;
}

export const ViewModeSwitcher = ({
    currentView,
    onChange,
}: ViewModeSwitcherProps) => {
    const activeColors: Record<ViewMode, string> = {
        diagrams: "blue.500",
        model: "purple.500",
        deployment: "green.500",
    };

    const getViewButton = (view: ViewMode, label: string) => {
        const isActive = currentView === view;
        const activeColor = activeColors[view];

        return (
            <Button
                variant="ghost"
                size="sm"
                borderRadius="full"
                onClick={() => onChange(view)}
                position="relative"
                color={isActive ? "white" : "gray.400"}
                _hover={{
                    bg: isActive ? activeColor : "whiteAlpha.200",
                    color: isActive ? "white" : "white",
                }}
                _active={{
                    transform: "scale(0.95)",
                }}
                transition="all 0.2s"
                bg={isActive ? activeColor : "transparent"}
                px={4}
                height="32px"
            >
                <HStack gap={2}>
                    <Text fontWeight="medium" fontSize="sm">
                        {label}
                    </Text>
                </HStack>
            </Button>
        );
    };

    return (
        <Box
            position="fixed"
            top="4"
            left="50%"
            transform="translateX(-50%)"
            bg="rgba(20, 20, 20, 0.8)"
            backdropFilter="blur(12px)"
            borderRadius="full"
            p="1"
            border="1px solid"
            borderColor="whiteAlpha.200"
            zIndex={1000}
            boxShadow="0 4px 20px rgba(0, 0, 0, 0.4)"
        >
            <HStack gap={1}>
                {getViewButton("diagrams", "Diagrams")}
                {getViewButton("model", "Model")}
                {getViewButton("deployment", "Deployment")}
            </HStack>
        </Box>
    );
};
