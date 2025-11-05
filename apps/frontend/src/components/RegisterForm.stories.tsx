import type { Meta, StoryObj } from "@storybook/react-vite";
import RegisterForm from "./RegisterForm";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { http, HttpResponse } from "msw";

const meta = {
    title: 'Components/RegisterForm',
    component: RegisterForm,
    parameters: {
        layout: 'centered',
    },
} satisfies Meta<typeof RegisterForm>

export default meta;

type Story = StoryObj<typeof RegisterForm>;

export const Default: Story = {};

export const RegisterCorrect: Story = {
    parameters: {
        msw: {
            handlers: [
                http.post('/api/register', async ({ request }) => {
                    await new Promise((res) => setTimeout(res, 300));

                    const body = (await request.json()) as {
                        email: string;
                        name: string;
                    };

                    if (!body) return HttpResponse.json({ isSuccess: false });
                    return HttpResponse.json({
                        isSuccess: true,
                        data: {
                            id: "user-1",
                            name: body.name,
                            email: body.email,
                        }
                    });
                }),
            ]
        }
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        const nameInput = canvas.getByLabelText(/nombre/i);
        const emailInput = canvas.getByLabelText(/email/i);
        const passwordInput = canvas.getByPlaceholderText("Password");
        const confirmInput = canvas.getByPlaceholderText(/confirmar password/i);
        const registerButton = canvas.getByRole("button", { name: /registrarse/i });

        await userEvent.type(nameInput, "Almiron Ronaldo");
        await userEvent.type(emailInput, "alm@gmail.com");
        await userEvent.type(passwordInput, "12345678");
        await userEvent.type(confirmInput, "12345678");

        await userEvent.click(registerButton);

        await waitFor(async () => {
            const successMessage = await canvas.findByText(/Cuenta creada exitosamente/i);
            expect(successMessage).toBeInTheDocument();
        }, { timeout: 10000 });
    }
}

export const RegisterError: Story = {
    parameters: {
        msw: {
            handlers: [
                http.post("/api/register", () =>
                    HttpResponse.json(
                        { isSuccess: false, error: "Email ya registrado" },
                        { status: 400 }
                    )
                ),
            ],
        },
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        const nameInput = canvas.getByLabelText(/nombre/i);
        const emailInput = canvas.getByLabelText(/email/i);
        const passwordInput = canvas.getByPlaceholderText("Password");
        const confirmInput = canvas.getByPlaceholderText(/confirmar password/i);
        const registerButton = canvas.getByRole("button", { name: /registrarse/i });

        await userEvent.type(nameInput, "Almiron Ronaldo");
        await userEvent.type(emailInput, "rony@gmail.com");
        await userEvent.type(passwordInput, "12345678");
        await userEvent.type(confirmInput, "12345678");

        await userEvent.click(registerButton);
        await waitFor(async () => {
            const errorMessage = await canvas.findByText(/Email ya registrado/i);
            expect(errorMessage).toBeInTheDocument();
        });
    },
};

export const RegisterErrorConfirmPassword: Story = {
    parameters: {
        msw: {
            handlers: [
                http.post("/api/register", () =>
                    HttpResponse.json(
                        { isSuccess: false, error: "Las contraseñas no coinciden" }
                    )
                ),
            ],
        },
    },

    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        const nameInput = canvas.getByLabelText(/nombre/i);
        const emailInput = canvas.getByLabelText(/email/i);
        const passwordInput = canvas.getByPlaceholderText("Password");
        const confirmInput = canvas.getByPlaceholderText(/confirmar password/i);
        const registerButton = canvas.getByRole("button", { name: /registrarse/i });

        await userEvent.type(nameInput, "Cristian Perez");
        await userEvent.type(emailInput, "cristian@gmail.com");
        await userEvent.type(passwordInput, "password");
        await userEvent.type(confirmInput, "OtroPassword");

        await userEvent.click(registerButton);
        await waitFor(async () => {
            const errorMessage = await canvas.findByText(/Las contraseñas no coinciden/i);
            expect(errorMessage).toBeInTheDocument();
        });
    },
};


