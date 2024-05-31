import React from 'react';
import {X} from "@/components/Icons";
interface Props {
    title: string;
    onClose: () => void;
}
const HeaderModal = ({title, onClose}:Props) => {
    return (
        <div className="flex justify-between border-b pb-3">
            <span className="text-black-2 text-lg">{title}</span>
            <button onClick={onClose}><X/></button>
        </div>
    );
};

export default HeaderModal;