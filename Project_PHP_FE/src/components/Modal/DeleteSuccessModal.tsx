import React, {useEffect, useState} from 'react';
import {Check} from "@/components/Icons";
import {useRouter} from "next/navigation";

interface Props {
    title: string;
    message: string;
    onClose: () => void;
}
const SuccessModal = ({title = "", message = "", onClose} : Props) => {
    const [countdown, setCountdown] = useState<number>(3);

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prevCountdown) => prevCountdown - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (countdown === 0) {
            onClose();
        }
    }, [countdown]);

    return (
        <div className={`fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-20 -z-1'}`}>
            <div className="max-w-lg max-h-96 overflow-hidden bg-white rounded p-5 sm:min-w-100 xsm:min-w-full">
                <div className="pt-3 pb-5 flex flex-col gap-2">
                    <div className="flex justify-center">
                        <div className="bg-[#DCFCE7] rounded-full p-1.5 w-fit">
                            <Check/>
                        </div>
                    </div>
                    <div className='text-center'>
                        <div className="font-semibold">
                            {title}
                        </div>
                        <p>{message}</p>
                        <p>Tự chuyển sang trang danh sách sau {countdown} giây</p>
                    </div>
                </div>
                <div className="flex justify-center gap-2">
                    <button className="btn bg-[#e3e9ed] py-1" onClick={onClose}>Ok</button>
                </div>
            </div>
        </div>
    );
};

export default SuccessModal;