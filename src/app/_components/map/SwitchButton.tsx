import { SlDocs } from 'react-icons/sl'
import { BsChatRight } from 'react-icons/bs'
import { useCallback, useState } from 'react'


interface switchButtonProps {
    variant: string;
    onClick: () => void;
    tag1: string;
    tag2: string;
}

interface selectedButtonProps {
    label: string;
    icon: any;
    selected: boolean;
    onClick: () => void;
}

const SelectionButton: React.FC<selectedButtonProps> = ({ label, icon: Icon, selected, onClick }) => {
    return (
        <div className={`${selected ? 'bg-gray-100' : 'bg-white text-gray-500'} flex px-6 py-3 w-48 rounded-md justify-center`} onClick={onClick}>
            <Icon className="text-azul font-bold self-center mr-2" onClick={onClick} />
            {label}
        </div>
    )
}


const SwitchButton: React.FC<switchButtonProps> = ({ variant, onClick, tag1, tag2 }) => {

    return (
        <div className="w-full flex flex-col justify-center z-50 py-2 mt-5 gap-3">
            <div className='flex mx-auto bg-white p-1 rounded-md shadow-md'>
                <SelectionButton label={tag1} icon={SlDocs} selected={variant == tag1} onClick={onClick} />
                <SelectionButton label={tag2} icon={BsChatRight} selected={variant == tag2} onClick={onClick} />
            </div>
        </div>
    )
}

export default SwitchButton