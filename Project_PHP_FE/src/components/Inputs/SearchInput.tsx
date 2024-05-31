import React, {useEffect, useId, useRef, useState} from 'react';
import {ArrowDown, CirclePlus} from "@/components/Icons";

interface SearchInputProps {
    label: string;
    placeholder: string;
    name: string;
    options?: string[];
}

const suppliers: string[] = [
    "Hằng Nghị",
    "Lý Kiến Thanh",
    "Trường Hưng",
    "Hải Tiến",
    "Cao Nguyên",
    "Vĩnh Thái",
    "Tân Nguyên",
    "Nguyên Hoàng",
    "Thượng Hải",
    "Hùng Long",
    "Đông Dương",
    "Minh Tâm",
    "Phú Thọ",
    "Hưng Đạo",
    "An Thịnh",
];

const SearchInput = ({label, placeholder, name, options = suppliers}: SearchInputProps) => {
    const id: string = useId();
    const [showDropdown, setShowDropdown] = useState<boolean>(false);
    const [inputValue, setInputValue] = useState<string>('');
    const [filteredOptions, setFilteredOptions] = useState<string[]>(options);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) && inputRef.current && !inputRef.current.contains(event.target as Node)) {
            setShowDropdown(false);
        }
    };

    const handleOptionClick = (option: string) => {
        setShowDropdown(false);
        if (inputRef.current) {
            setInputValue(option);
        }
    }

    const handleCreateOption = () => {
        setShowDropdown(false);
        options.push(inputValue);
        const filtered = options.filter(option => removeVietnameseAccent(option).includes(removeVietnameseAccent(inputValue)));
        setFilteredOptions(filtered);
    }

    const removeVietnameseAccent = (vietnameseString: string) => {
        return vietnameseString.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    }

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const filtered = options.filter(supplier => removeVietnameseAccent(supplier).includes(removeVietnameseAccent(inputValue)));
        setFilteredOptions(filtered);
    }, [inputValue]);

    return (
        <div className="w-full mb-6">
            <label className="block tracking-wide text-gray-700 text-sm font-bold mb-2" htmlFor={id}>
                {label}
            </label>
            <div className="relative">
                <input
                    className="block appearance-none w-full text-xs bg-gray-200 border border-gray-200 text-gray-700 py-2 px-4 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    type="text"
                    placeholder={placeholder}
                    name={name}
                    onClick={() => setShowDropdown(true)}
                    ref={inputRef}
                    value={inputValue}
                    id={id}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => setInputValue(event.target.value)}
                />
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <ArrowDown/>
                </div>
                <div ref={dropdownRef}
                     className={`${!showDropdown && "hidden"} shadow-lg shadow-[#21212133] absolute w-full rounded text-xs bg-white z-50 overflow-y-auto max-h-40`}>
                    {
                        filteredOptions.length === 0 ? (
                            <React.Fragment>
                                <div className="px-4 py-2.5 hover:bg-[#2962ff26]" onClick={handleCreateOption}>
                                    <div className="flex gap-2">
                                        <CirclePlus width={15} height={15}/>
                                        <span>Thêm mới &#34;{inputValue}&#34;</span>
                                    </div>
                                </div>
                                <div className="px-4 py-2.5">
                                    <span className="italic">Không có dữ liệu</span>
                                </div>
                            </React.Fragment>
                        ) : (
                            filteredOptions.map((option: string, index: number) => (
                                <div key={index} className="px-4 py-2.5 hover:bg-[#2962ff26]"
                                     onClick={() => handleOptionClick(option)}>
                                    <span>{option}</span>
                                </div>
                            ))
                        )
                    }

                </div>
            </div>
        </div>
    );
};

export default SearchInput;