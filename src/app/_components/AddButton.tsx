
export default function AddButton({label, onClick} : { label: string, onClick: () => void }) {
    return (
        <div className="flex justify-end">
            <button onClick={onClick} className="bg-verde hover:bg-verde-200 text-white font-semibold py-2 px-4 rounded">
                {label}
            </button>
        </div>
    )
}