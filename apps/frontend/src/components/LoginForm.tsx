import { useState } from "react"
import { useAuth } from "../hooks/useAuth"
import Message from "./Message";
import Input from "./Input";
import Button from "./Button";

const LoginForm = () => {

    const { login, error } = useAuth();
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [message, setMessage] = useState<{ type: string, text: string }>({
        type: "",
        text: ""
    });

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!email || !password) {
            setMessage({
                type: "error",
                text: "Todos los campos son obligatorios"
            })
            setTimeout(() => {
                setMessage({
                    type: "",
                    text: ""
                })
            }, 5000)
            return
        }

        const response = await login({ email, password });
        console.log(response);
        if (response.isSuccess) {
            setMessage({
                type: "success",
                text: "Inicio de sesión exitoso"
            })
        }

        setEmail("");
        setPassword("");

        setTimeout(() => {
            setMessage({
                type: "",
                text: ""
            })
        }, 5000)
    }

    const handleChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
        const email = event.target.value;
        setEmail(email);
    }

    const handleChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    }

    return (
        <section className="w-full min-w-2xs  mx-auto my-20 md:w-lg flex flex-col gap-2 shadow shadow-sky-200/60 bg-blue-50 p-6 py-8 rounded-xl bg-linear-to-tr from-sky-50 to-gray-100 ">
            <header className="w-full flex flex-col justify-between items-center">
                <h2 className="text-4xl font-bold text-sky-600 mt-4 mb-8 font-nunito">Plonio.</h2>
                <h2 className="text-lg font-bold text-gray-500 mb-2">Iniciar Sesión</h2>
                <p className="text-sm text-gray-400">Por favor ingresa tus credenciales</p>
            </header>
            <form onSubmit={handleSubmit} className="flex flex-col gap-2 mb-4">
                <Input label="Email" placeholder="Email"
                    value={email} type="email" message="" onChange={handleChangeEmail} />
                <Input label="Contraseña" placeholder="Password"
                    value={password} type="password" message="" onChange={handleChangePassword} />
                <Button primary size="large" type="submit" label="Iniciar Sesión" />
            </form>

            {(message?.type || error) && (
                <Message
                    type={message?.type === "success" ? "success" : "error"}
                    message={message?.text || error as string}
                />
            )}

            <footer className="flex gap-2 items-center justify-center mt-2">
                <p className="text-sm text-gray-400">No tienes una cuenta?</p>
                <button className="text-sky-600 underline text-sm cursor-pointer">Crear Cuenta</button>
            </footer>
        </section>
    )
}

export default LoginForm