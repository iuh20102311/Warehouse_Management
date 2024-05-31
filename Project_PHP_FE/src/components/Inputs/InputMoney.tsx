import React, {useEffect, useId, useState} from 'react';

interface Props {
    label?: string;
    hideLabel?: boolean;
    placeholder: string;
    name: string;
    min?: number;
    max?: number;
    required?: boolean;
    value?: string | number | readonly string[] | undefined;
    onChange?: (value: string) => void;
    defaultValue?: string | number | readonly string[] | undefined;
}

const InputMoney = ({label, placeholder, name, min, max, required = true, value, onChange, defaultValue, hideLabel = false}: Props) => {
    const id = useId();
    const [formattedValue, setFormattedValue] = useState<string>(value?.toString || '');

    useEffect(() => {
        if (value !== undefined) {
            setFormattedValue(formatCurrency(value.toString()));
        } else if (defaultValue !== undefined) {
            setFormattedValue(formatCurrency(defaultValue.toString()));
        }
    }, [value, defaultValue]);
    const formatCurrency = (value: string): string => {
        const formatter = new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        });
        return formatter.format(Number(value.replace(/\D/g, '')));
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        setFormattedValue(newValue);
        onChange && onChange(newValue);
    };
    const handleBlur = () => {
        if (formattedValue) {
            const formattedAmount = formatCurrency(formattedValue);
            setFormattedValue(formattedAmount);
            onChange && onChange(formattedAmount);
        }
    }

    const handleFocus = () => {
        const numericValue = formattedValue.replace(/\D/g, '');
        setFormattedValue(numericValue);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'ArrowUp') {
            event.preventDefault();
            const numericValue = parseInt(formattedValue.replace(/\D/g, ''), 10) || 0;
            const incrementedValue = Math.min((numericValue + 1), max ?? Number.MAX_SAFE_INTEGER);
            setFormattedValue(incrementedValue.toString());
            onChange && onChange(incrementedValue.toString());
        }
        if (event.key === 'ArrowDown') {
            event.preventDefault();
            const numericValue = parseInt(formattedValue.replace(/\D/g, ''), 10) || 0;
            const decrementedValue = Math.max((numericValue - 1), min ?? 0);
            setFormattedValue(decrementedValue.toString());
            onChange && onChange(decrementedValue.toString());
        }
    }

    return (
        <div className="w-full mb-6 xsm:mb-3">
            {
                !hideLabel && label && (
                    <label className="block tracking-wide text-gray-700 text-sm font-bold mb-2"
                           htmlFor={id}>
                        {label}
                    </label>
                )
            }
            <input onChange={handleChange}
                   onBlur={handleBlur}
                   onFocus={handleFocus}
                   onKeyDown={handleKeyDown}
                   defaultValue={defaultValue}
                   value={formattedValue}
                   className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded text-xs py-2 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                   name={name} id={id} type="text" placeholder={placeholder} min={min} max={max} required={required}/>
        </div>
    );
};

export default InputMoney;