'use client';

import { IoMdCloseCircleOutline } from "react-icons/io";
import Button from "./Button";

export default function Modal({ children, title, onClose, isOpen, customButtonAction, customButtonLabel }: { children: React.ReactNode, title: string, onClose: () => void, isOpen: boolean, customButtonAction?: () => void, customButtonLabel?: string }) {
    return (
        // add a button with x icon to close the modal
        <div className={`fixed z-10 inset-0 overflow-y-auto ${isOpen ? "" : "hidden"}`}>
            <div className="fixed z-10 inset-0 overflow-y-auto">
                <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                        <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                    </div>
                    <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                    <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full" role="dialog" aria-modal="true" aria-labelledby="modal-headline">

                        <div className="bg-white pt-8 pb-4 sm:p-6 sm:pb-4">
                            <div className="">
                                <div className="mt-3 text-center sm:mt-0 sm:text-left">
                                    <div className="flex flex-row justify-between items-center pb-6">

                                        <h3 className="text-xl leading-6 font-semibold text-gray-900" id="modal-headline">
                                            {title}
                                        </h3>
                                        <button onClick={onClose} className="text-gris text-xl hover:text-gray-400">
                                            <IoMdCloseCircleOutline />
                                        </button>
                                    </div>
                                    <div className="mt-2">
                                        {children}
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

{/* <div className="bg-white px-4 py-6 sm:px-6 sm:flex sm:flex-row-reverse flex gap-4">
                            {customButtonAction && customButtonLabel && 
                            <Button label={customButtonLabel} onClick={customButtonAction} />
                            }
                            <Button label="Cerrar" onClick={onClose} secondary />
                        </div> */}