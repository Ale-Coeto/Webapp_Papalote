
export default function Button({label, onClick, secondary, full} : { label: string, secondary?: boolean, full?: boolean, onClick: () => void }) {
    return (
        <div className="flex justify-end">
            <button onClick={onClick} className={`bg-verde hover:bg-verde-200 text-white font-semibold py-2 px-4 rounded ${secondary ? "bg-slate-400 hover:bg-slate-300" : ""} ${full && "w-full"}`}>
                {label}
            </button>
        </div>
    )
}