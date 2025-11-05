import { LogOutIcon } from "lucide-react"
import { useAuth } from "../hooks/useAuth"
import Button from "./Button"

type User = {
    name: string
}

export interface HeaderProps {
    user?: User
}

function Header({ user }: HeaderProps) {
    const { logout } = useAuth();

    return (
        <header className="w-full flex flex-row items-center justify-between bg-blue-50 p-2 px-4 border-b border-gray-400">
            <h2 className="text-2xl font-bold text-sky-600">Plonio.</h2>
            <section className="flex flex-row justify-between gap-2 items-center">
                <p>Bienvenido,</p>
                <span>{user?.name}</span>
                <Button size="medium" label="Cerrar Sesión" icon={<LogOutIcon size={16} />} onClick={logout} />
            </section>
        </header>
    )
}

export default Header

