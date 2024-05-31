import React, {useId} from 'react';

interface SelectProps {
    label: string;
    name: string;
    children: React.ReactNode;
    defaultValue?: string | number | readonly string[] | undefined;
    value?: string | number | readonly string[] | undefined;
    onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => Promise<void> | undefined | void;
}

const Select = ({label, name, children, defaultValue, onChange, value}: SelectProps) => {
    const id: string = useId();
    const handleDefaultChange = (event: React.ChangeEvent<HTMLSelectElement>) => {};
    const handleChange = onChange || handleDefaultChange;
    return (
        <div className="w-full mb-6">
            <label className="block tracking-wide text-gray-700 text-sm font-bold mb-2" htmlFor={id}>
                {label}
            </label>
            <div className="relative">
                <select
                    className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-2 px-4 mb-3 text-xs rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id={id}
                    name={name}
                    onChange={handleChange}
                    defaultValue={defaultValue}
                    value={value}
                >
                    {children}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                    </svg>
                </div>
            </div>
        </div>
    );
};

export default Select;