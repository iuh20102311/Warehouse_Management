import React from 'react';
interface Props {
    children: React.ReactNode;
}
const ContainerModal = ({children} : Props) => {
    return (
        <div
            className={`fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-20 -z-1'}`}>
            <div className="max-w-[1000px] overflow-hidden bg-white rounded p-5 sm:min-w-100 xsm:min-w-full">
                {children}
            </div>
        </div>
    );
};

export default ContainerModal;