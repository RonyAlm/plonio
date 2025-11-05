export interface InputProps {
    label?: string;
    placeholder?: string;
    value: string;
    type?: string;
    message?: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input = ({ label, placeholder, value, type, message, onChange }: InputProps) => {
    return (
        <div className="flex flex-col gap-2 py-2">
            <label className="text-sm" htmlFor={type}>{label}</label>
            <input
                type={type}
                name={type}
                className="w-full border text-sm border-gray-400 rounded-lg p-2 outline-sky-600/50"
                placeholder={placeholder}
                aria-label={label}
                value={value}
                onChange={onChange}
                required
            />
            {message && <p className="ml-4 text-sm text-red-600">{message}</p>}

            {/* <div className="flex flex-row gap-2 items-center">
                        <CheckIcon size={16} className="text-green-600" />
                        <span className="text-sm text-gray-400">Email válido</span>
                    </div> */}
        </div>
    )
}

export default Input