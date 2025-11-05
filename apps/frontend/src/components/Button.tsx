export interface ButtonProps {
    type?: 'submit' | 'reset' | 'button';
    primary?: boolean;
    size?: 'small' | 'medium' | 'large';
    label: string;
    onClick?: () => void;
    icon?: React.ReactNode
}

const Button = ({
    type = 'button',
    primary = false,
    size = 'medium',
    label,
    icon,
    onClick
}: ButtonProps) => {
    const hasLabel = Boolean(label);
    const mode = primary
        ? 'bg-sky-600 text-white hover:bg-sky-700 active:bg-sky-800 outline-offset-2 outline-sky-600'
        : 'bg-transparent text-sky-600 border border-sky-600 hover:bg-sky-50 active:bg-sky-100 outline-offset-2 outline-sky-600';

    const sizes = {
        small: 'text-sm max-w-[100px]',
        medium: hasLabel && 'text-base min-w-[150px]',
        large: hasLabel && 'text-base min-w-[200px]'
    }

    return (
        <button
            type={type}
            className={['flex flex-row gap-1 items-center justify-center py-2 px-4 rounded-full cursor-pointer',
                `${sizes[size]}`, mode, !hasLabel && 'p2 aspect-square'].join(' ')}
            onClick={onClick}
        >              
            {icon && (icon)}
            {hasLabel && label}
        </button>
    );
};

export default Button