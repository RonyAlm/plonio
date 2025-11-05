import type { Meta, StoryObj } from "@storybook/react-vite";
import LoginForm from "./LoginForm";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { http, HttpResponse } from "msw";

const meta = {
    title: 'Components/LoginForm',
    component: LoginForm,
    parameters: {
        layout: 'centered',
    },
} satisfies Meta<typeof LoginForm>

export default meta;

type Story = StoryObj<typeof LoginForm>;

export const Default: Story = {};

export const LoginSuccess: Story = {
    parameters: {
        msw: {
            handlers: [
                http.post('/api/login', async ({ request }) => {
                    await new Promise((res) => setTimeout(res, 300));
                    const body = (await request.json()) as {
                        email: string;
                        password: string;
                    };
                    return HttpResponse.json({
                        isSuccess: true,
                        user: {
                            id: "user-1",
                            name: "Rony Almiron",
                            email: body?.email as string,
                        },
                        accessToken: "tokendeacceso",
                        refreshToken: "tokenrefrescar"
                    });
                }),
            ]
        }
    },
    play: async ({ canvasElement }) => {

        const canvas = within(canvasElement);

        const emailInput = canvas.getByLabelText(/email/i);
        const passwordInput = canvas.getByPlaceholderText("Password");
        const loginButton = await canvas.getByRole('button', { name: /Iniciar sesi/i });


        await userEvent.type(emailInput, "alm@gmail.com");
        await userEvent.type(passwordInput, "rony12345678");

        await userEvent.click(loginButton);

        await waitFor(async () => {
            const errorMessage = await canvas.findByText(/Inicio de sesión exitoso/i);
            expect(errorMessage).toBeInTheDocument();

            expect(localStorage.getItem("loggedUser")).not.toBeNull();

            const stored = JSON.parse(localStorage.getItem("loggedUser") as string);
            expect(stored.email).toBe("alm@gmail.com");

            await localStorage.removeItem("loggedUser");
        });


    }
}

export const LoginError: Story = {
    parameters: {
        msw: {
            handlers: [
                http.post('/api/login', async () => {
                    await new Promise((res) => setTimeout(res, 300));
                    return HttpResponse.json({
                        isSuccess: false,
                        error: "Invalid credentials"
                    });
                }),
            ]
        }
    },

    play: async ({ canvasElement }) => {

        const canvas = within(canvasElement);

        const emailInput = canvas.getByLabelText(/email/i);
        const passwordInput = canvas.getByPlaceholderText("Password");
        const loginButton = await canvas.getByRole('button', { name: /Iniciar sesi/i });


        await userEvent.type(emailInput, "rony@gmail.com");
        await userEvent.type(passwordInput, "dfsfafdfsdfsdfsdf");

        await userEvent.click(loginButton);

        await waitFor(async () => {
            const errorMessage = await canvas.findByText(/incorrectas/i);
            expect(errorMessage).toBeInTheDocument();
        });
    }
}

