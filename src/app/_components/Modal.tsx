'use client';

export default function Modal({ children, title, onClose, isOpen, customButtonAction, customButtonLabel }: { children: React.ReactNode, title: string, onClose: () => void, isOpen: boolean, customButtonAction?: () => void, customButtonLabel?: string }) {
    return (
        <div className={`fixed z-10 inset-0 overflow-y-auto ${isOpen ? "" : "hidden"}`}>
            <div className="fixed z-10 inset-0 overflow-y-auto">
                <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                        <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                    </div>
                    <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                    <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full" role="dialog" aria-modal="true" aria-labelledby="modal-headline">
                        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <div className="sm:flex sm:items-start">
                                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
                                        {title}
                                    </h3>
                                    <div className="mt-2">
                                        {children}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                            {customButtonAction && customButtonLabel && 
                            <button onClick={customButtonAction} type="button" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-verde text-base font-medium text-white hover:bg-verde-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-verde sm:ml-3 sm:w-auto sm:text-sm">
                                {customButtonLabel}
                            </button>}
                            <button onClick={onClose} type="button" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-verde text-base font-medium text-white hover:bg-verde-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-verde sm:ml-3 sm:w-auto sm:text-sm">
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}