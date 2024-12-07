import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./button";

const meta: Meta<typeof Button> = {
    title: "UI/Button",
    component: Button,
    argTypes: {
        appName: {
            control: {
                type: "text",
            },
        },
    },
    parameters: {
        backgrounds: {
            default: "dark",
        }
    }
} satisfies Meta<typeof Button>;

type Story = StoryObj<typeof Button>;

export default meta;

export const Primary: Story = {
    args: {
        appName: "React",
        children: "React"
    },
}