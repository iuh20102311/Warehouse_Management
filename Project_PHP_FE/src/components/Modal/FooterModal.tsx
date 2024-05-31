import React from 'react';

interface FooterModalProps {
    onClose: () => void;
    disabledRightBtn: boolean;
    onClickRightBtn:  () => void;
    messageRightBtn: string;
}

const FooterModal = ({onClose, disabledRightBtn, onClickRightBtn, messageRightBtn}: FooterModalProps) => {
    return (
        <div className="flex justify-end gap-2">
            <button className="btn bg-[#e3e9ed] py-1" onClick={onClose}>Hủy</button>
            <button
                className={`py-2.5 px-4 rounded text-white ${disabledRightBtn ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-500 cursor-pointer hover:bg-blue-700'}`}
                onClick={onClickRightBtn}
                disabled={disabledRightBtn}>{messageRightBtn}
            </button>
        </div>
    );
};

export default FooterModal;