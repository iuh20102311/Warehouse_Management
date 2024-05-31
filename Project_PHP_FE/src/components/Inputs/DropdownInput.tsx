import React, {useEffect, useId, useRef, useState} from 'react';
import {ArrowDown} from "@/components/Icons";
interface DropdownInputProps {
    name?: string;
    id?: string;
    options?: Option[];
    onChangeDropdown: (option: string) => void;
    selectedValue: string;
    onChangeInputSearch:  React.ChangeEventHandler<HTMLInputElement> | undefined;
    inputSearchValue: string;
}

export interface Option{
    key: string,
    value: string,
}
const DropdownInput = ({id, name, options = [], onChangeDropdown, onChangeInputSearch, inputSearchValue, selectedValue} : DropdownInputProps) => {
    const [showDropdown, setShowDropdown] = useState<boolean>(false);
    const [inputValue, setInputValue] = useState<string>(options[0]?.value || '');
    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const generatedId = useId();
    const finalId = id || generatedId;


    useEffect(() => {
        const selectedOption = options.find(option => option.key === selectedValue);
        if (selectedOption) {
            setInputValue(selectedOption.value);
        } else {
            setInputValue(options[0]?.value || '');
        }
    }, [options, selectedValue]);
    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) && inputRef.current && !inputRef.current.contains(event.target as Node)) {
            setShowDropdown(false);
        }
    };

    const handleOptionClick = (option: Option) => {
        setShowDropdown(false);
        if (inputRef.current) {
            setInputValue(option.value);
            onChangeDropdown(option.key)
        }
    }

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    return (
        <div className="flex flex-row w-full">
            <div className="relative w-fit">
                <input
                    className="block appearance-none cursor-default w-full rounded-l text-xs bg-gray-200 border border-gray-200 text-gray-700 py-2 pl-3 pr-6.5 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    type="text"
                    readOnly
                    name={name}
                    onClick={() => setShowDropdown(true)}
                    ref={inputRef}
                    value={inputValue}
                    id={finalId}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => setInputValue(event.target.value)}
                />
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <ArrowDown/>
                </div>
                <div ref={dropdownRef}
                     className={`${!showDropdown && "hidden"} shadow-lg shadow-[#21212133] absolute w-full rounded text-xs bg-white z-50 overflow-y-auto max-h-40`}>
                    {
                        options?.map((option: Option, index: number) => (
                            <div key={index} className="px-4 py-2.5 hover:bg-[#2962ff26]"
                                 onClick={() => handleOptionClick(option)}>
                                <span>{option.value}</span>
                            </div>
                        ))
                    }

                </div>
            </div>
            <input type="text" className="border rounded-r px-3 w-full text-xs focus:outline-none" placeholder="Nhập" onChange={onChangeInputSearch} value={inputSearchValue}/>
        </div>
    );
};

export default DropdownInput;