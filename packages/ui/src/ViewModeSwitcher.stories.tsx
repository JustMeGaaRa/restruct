import type { Meta, StoryObj } from "@storybook/react";
import { ViewModeSwitcher, ViewMode } from "./ViewModeSwitcher";
import { useState } from "react";
import { Box } from "@chakra-ui/react";

const meta: Meta<typeof ViewModeSwitcher> = {
    title: "UI/ViewModeSwitcher",
    component: ViewModeSwitcher,
    parameters: {
        layout: "fullscreen",
        backgrounds: {
            default: "dark",
        },
    },
    decorators: [
        (Story) => (
            <Box h="100vh" w="100vw" bg="gray.900" position="relative">
                <Story />
            </Box>
        ),
    ],
};

export default meta;

type Story = StoryObj<typeof ViewModeSwitcher>;

const ViewModeSwitcherWrapper = () => {
    const [view, setView] = useState<ViewMode>("diagrams");
    return <ViewModeSwitcher currentView={view} onChange={setView} />;
};

export const Default: Story = {
    render: () => <ViewModeSwitcherWrapper />,
};

export const ModelsView: Story = {
    render: () => {
        const [view, setView] = useState<ViewMode>("model");
        return <ViewModeSwitcher currentView={view} onChange={setView} />;
    },
};

export const DeploymentView: Story = {
    render: () => {
        const [view, setView] = useState<ViewMode>("deployment");
        return <ViewModeSwitcher currentView={view} onChange={setView} />;
    },
};
