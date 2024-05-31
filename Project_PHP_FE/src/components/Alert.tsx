import React, {FC} from 'react';
import {Info} from "@/components/Icons";

interface AlertProps {
    message: string;
    type: "error" | "warning" | "info" | "success";
}

interface ColorScheme {
    bg: string;
    text: string;
    border: string;
    title: string;
}


const Alert : FC<AlertProps> = ({message, type}) : React.JSX.Element => {
    const colorSchemes: Record<AlertProps["type"], ColorScheme> = {
        error: {
            bg: 'bg-[#FEE2E2]',
            text: 'text-[#B91C1C]',
            border: 'border-[#F87171]',
            title: "Thông báo lỗi: "
        },
        warning: {
            bg: 'bg-yellow-100',
            text: 'text-yellow-700',
            border: 'border-yellow-400',
            title: "Cảnh báo: "
        },
        info: {
            bg: 'bg-blue-100',
            text: 'text-blue-700',
            border: 'border-blue-400',
            title: "Thông tin: "
        },
        success: {
            bg: 'bg-green-100',
            text: 'text-green-700',
            border: 'border-green-400',
            title: "Thành công: "
        },
    };

    return (
        <div className="fixed bottom-4 right-7.5 z-9999">
            <div className={`flex rounded-lg p-4 mb-4 ${colorSchemes[type].bg}`}>
                <Info className={colorSchemes[type].text}/>
                <p className={`ml-3 text-sm ${colorSchemes[type].text}`}>
                    <span className="font-bold">{colorSchemes[type].title}</span>{message}
                </p>
            </div>
        </div>
    );
};

export default Alert;