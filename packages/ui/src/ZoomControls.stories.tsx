import type { Meta, StoryObj } from "@storybook/react";
import { ZoomControls } from "./ZoomControls";
import { ViewportProvider } from "@graph/svg";
import { Box } from "@chakra-ui/react";

const meta: Meta<typeof ZoomControls> = {
    title: "UI/ZoomControls",
    component: ZoomControls,
    parameters: {
        layout: "fullscreen",
        backgrounds: {
            default: "dark",
        },
    },
    decorators: [
        (Story) => (
            <ViewportProvider>
                <div
                    style={{
                        position: "relative",
                        width: "100vw",
                        height: "100vh",
                    }}
                >
                    <svg className="graph__viewport" width="100%" height="100%">
                        <rect
                            x="0"
                            y="0"
                            width="1000"
                            height="1000"
                            fill="#2d2d2d"
                        />
                        <circle cx="500" cy="500" r="100" fill="teal" />
                    </svg>
                    <Story />
                </div>
            </ViewportProvider>
        ),
    ],
};

export default meta;

type Story = StoryObj<typeof ZoomControls>;

export const Default: Story = {};
