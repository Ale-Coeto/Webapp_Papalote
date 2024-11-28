import { IoIosAdd } from "react-icons/io";
import { cn } from "~/lib/utils";

interface ButtonProps {
    label: string;
    onClick?: () => void;
    secondary?: boolean;
    full?: boolean;
    submit?: boolean;
    danger?: boolean;
    isAdd?: boolean;
}

export default function Button({ label, onClick, secondary, full, submit, danger, isAdd }: ButtonProps) {
    return (
        <div className="flex justify-end">
            <button type={submit ? "submit" : "button"} onClick={onClick}
                className={`text-white font-semibold py-2 px-4 rounded 
            ${secondary ? "bg-slate-400 hover:bg-slate-300" :
                        danger ? "bg-red-500 hover:bg-red-400" : "bg-verde hover:bg-verde-200"} 
            ${full && "w-full"}`}>
                <div className="flex flex-row items-center pr-2">
                    {isAdd && 
                    <IoIosAdd className={cn("text-3xl text-white")} />
                    }
                    {label}
                </div>
            </button>
        </div>
    )
}