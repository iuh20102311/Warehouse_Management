import React from 'react';
interface Props {
    children: React.ReactNode;
}
const BodyModal = ({children}:Props) => {
    return (
        <div className="py-3">
            {children}
        </div>
    );
};

export default BodyModal;