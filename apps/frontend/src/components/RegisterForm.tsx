
import { useState } from "react"
import { useAuth } from "../hooks/useAuth"
import Message from "./Message";
import Input from "./Input";
import Button from "./Button";

const RegisterForm = () => {

    const { createAccount, error } = useAuth();
    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [message, setMessage] = useState<{ type: string, text: string }>({
        type: "",
        text: ""
    });

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!email || !password || !name || !confirmPassword) {
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

        if (password !== confirmPassword) {
            setMessage({
                type: "error",
                text: "Las contraseñas no coinciden"
            })
            setTimeout(() => {
                setMessage({
                    type: "",
                    text: ""
                })
            }, 5000)
            return
        }

        const savedUser = await createAccount({ name, email, password });
        if (savedUser.isSuccess) {
            setMessage({
                type: "success",
                text: "Cuenta creada exitosamente"
            })
        }

        setName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");

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

    const handleChangeConfirmPassword = (event: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmPassword(event.target.value);
    }

    const handleChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    }

    return (
        <section className="w-full min-w-2xs mx-auto my-auto md:w-lg flex flex-col gap-2 shadow shadow-sky-200/60 bg-blue-50 p-6 py-8 rounded-xl bg-linear-to-tr from-sky-50 to-gray-100 ">
            <header className="w-full flex flex-col justify-between items-center">
                <h2 className="text-4xl font-bold text-sky-600 mt-4 mb-8 font-nunito">Plonio.</h2>
                <h2 className="text-lg font-bold text-gray-500 mb-2">Registrate</h2>
                <p className="text-sm text-gray-400">Por favor completa el siguiente formulario</p>
            </header>
            <form onSubmit={handleSubmit} className="flex flex-col gap-2 mb-4">

                <Input label="Nombre" placeholder="Nombre"
                    value={name} type="text" message="" onChange={handleChangeName} />

                <Input label="Email" placeholder="Email"
                    value={email} type="email" message="" onChange={handleChangeEmail} />

                <Input label="Contraseña" placeholder="Password"
                    value={password} type="password" message="" onChange={handleChangePassword} />

                <Input label="Confirmar Contraseña" placeholder="Confirmar Password"
                    value={confirmPassword} type="password" message="" onChange={handleChangeConfirmPassword} />

                <Button primary size="large" type="submit" label="Registrarse" />
            </form>

            {(message?.type || error) && (
                <Message
                    type={message?.type === "success" ? "success" : "error"}
                    message={message?.text || error as string}
                />
            )}

            <footer className="flex gap-2 items-center justify-center mt-2">
                <p className="text-sm text-gray-400">Ya tienes una cuenta?</p>
                <button className="text-sky-600 underline text-sm cursor-pointer">Iniciar Sesión</button>
            </footer>
        </section>
    )
}

export default RegisterForm