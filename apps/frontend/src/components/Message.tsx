import { CheckCheckIcon, CircleXIcon } from "lucide-react"

export type TypeMsg = "error" | "success" | ""

interface MessageProps {
    type: TypeMsg
    message: string
}

const Message = ({ type = "error", message }: MessageProps) => {
    return (
        <div className={`py-2 px-4 rounded-sm flex flex-row gap-2 items-center justify-center ${type === "success" ? "bg-green-100" : "bg-red-100"}`}>
            {
                type === "success" ? (
                    <CheckCheckIcon size={16} className="text-green-600" />
                ) :
                    (
                        <CircleXIcon size={16} className="text-red-600" />
                    )
            }
            <p className="text-sm text-gray-600">{message}</p>
        </div>
    )
}

export default Message