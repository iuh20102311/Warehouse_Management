import React from 'react';
import {TriangleAlert, X} from "@/components/Icons";
interface ModalProps {
    title: string;
    message: string;
    onClose: () => void;
    onDelete: () => void;
}
const DeleteModal = ({title = "", message = "", onClose, onDelete} : ModalProps) => {
    return (
        <div className={`fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-20 -z-1'}`}>
            <div className="max-w-lg max-h-96 overflow-hidden bg-white rounded p-5 sm:min-w-100 xsm:min-w-full">
                <div className="pt-3 flex flex-row gap-5">
                    <div>
                        <div className="bg-[#FEE2E2] rounded-full p-1.5">
                            <TriangleAlert/>
                        </div>
                    </div>
                    <div>
                        <div className="font-semibold">{title}</div>
                        <p>{message}</p>
                    </div>
                </div>
                <div className="flex justify-end gap-2">
                    <button className="btn bg-[#e3e9ed] py-1" onClick={onClose}>Hủy</button>
                    <button className="btn bg-red text-white font-medium" onClick={onDelete}>Xóa</button>
                </div>
            </div>
        </div>
    );
};

export default DeleteModal;