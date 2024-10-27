interface ButtonProps {
    label: string;
    onClick?: () => void;
    secondary?: boolean;
    full?: boolean;
    submit?: boolean;
}

export default function Button({label, onClick, secondary, full, submit} : ButtonProps) {
    return (
        <div className="flex justify-end">
            <button type={submit ? "submit" : "button"} onClick={onClick} className={`bg-verde hover:bg-verde-200 text-white font-semibold py-2 px-4 rounded ${secondary ? "bg-slate-400 hover:bg-slate-300" : ""} ${full && "w-full"}`}>
                {label}
            </button>
        </div>
    )
}