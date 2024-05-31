import React from 'react';
import {X} from "@/components/Icons";
interface ModalProps {
    isOpen: boolean;
    title?: string;
    onClose: () => void;
    children: React.ReactNode;
}
const Modal = ({isOpen = false, title = "", children, onClose} : ModalProps) => {
    return (
        <div className={`fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-999999 ${!isOpen && 'hidden'}`}>
            <div className="max-w-lg max-h-96 overflow-hidden bg-white rounded p-4 sm:min-w-203 xsm:min-w-full">
                <div className="flex justify-between border-b pb-3">
                    <span className="text-black-2 text-lg">{title}</span>
                    <button onClick={onClose}><X/></button>
                </div>
                <div className="py-3">
                    {children}
                </div>
                <div className="flex justify-end gap-2">
                    <button className="btn bg-[#e3e9ed] py-1" onClick={onClose}>Hủy</button>
                    <button className="btn btn-blue">Xuất</button>
                </div>
            </div>
        </div>
    );
};

export default Modal;