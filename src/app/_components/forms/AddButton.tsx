import { IoIosAdd } from "react-icons/io";


export default function AddButton({onClick} : { onClick: () => void }) {
    return (
        <div className="flex justify-end">
            <button onClick={onClick} className="rounded-full border-2 p-1 shadow-sm hover:bg-slate-50">
                <IoIosAdd className="text-3xl text-gris " />
            </button>
        </div>
    )
}