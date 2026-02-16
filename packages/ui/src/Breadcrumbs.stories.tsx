import type { Meta, StoryObj } from "@storybook/react";
import { Breadcrumbs } from "./Breadcrumbs";
import { Box } from "@chakra-ui/react";

const meta: Meta<typeof Breadcrumbs> = {
    title: "UI/Breadcrumbs",
    component: Breadcrumbs,
    parameters: {
        layout: "fullscreen",
    },
    decorators: [
        (Story) => (
            <Box h="100vh" w="100vw" bg="gray.900" p={10}>
                <Story />
            </Box>
        ),
    ],
};

export default meta;
type Story = StoryObj<typeof Breadcrumbs>;

export const Default: Story = {
    args: {
        items: [
            {
                label: "System Landscape",
                onClick: () => console.log("System Landscape clicked"),
            },
            {
                label: "Big Bank plc",
                onClick: () => console.log("Big Bank plc clicked"),
            },
            {
                label: "Internet Banking System",
                onClick: () => console.log("Internet Banking System clicked"),
            },
        ],
    },
};

export const SingleItem: Story = {
    args: {
        items: [
            {
                label: "System Landscape",
                onClick: () => console.log("System Landscape clicked"),
            },
        ],
    },
};
