import type { Meta, StoryObj } from "@storybook/react-vite";
import Message from "./Message";


const meta = {
    title: 'Components/Message',
    component: Message,
    parameters: {
        layout: 'centered',
    },
    args: {
        type: 'error',
        message: 'Error al iniciar sesión'
    }
} satisfies Meta<typeof Message>

export default meta;

type Story = StoryObj<typeof Message>;

export const Error: Story = {};

export const Success: Story = {
    args: {
        type: 'success',
        message: 'Sesión iniciada correctamente'
    }
}