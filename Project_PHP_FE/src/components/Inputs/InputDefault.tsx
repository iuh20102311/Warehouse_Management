import React, {forwardRef, useId} from 'react';

interface Props {
    placeholder: string;
    type: "text" | "number" | "password" | "email" | "date" | "tel";
    name: string;
    min?: number;
    max?: number;
    required?: boolean;
    value?: string | number | readonly string[] | undefined;
    onChange?: React.ChangeEventHandler<HTMLInputElement> | undefined;
    defaultValue?: string | number | readonly string[] | undefined;
    onKeyDown?: React.KeyboardEventHandler<HTMLInputElement> | undefined;
}

const InputDefault = forwardRef<HTMLInputElement, Props>(({
                                                              placeholder,
                                                              type,
                                                              name,
                                                              min,
                                                              max,
                                                              required = true,
                                                              value,
                                                              onChange,
                                                              defaultValue,
                                                              onKeyDown,
                                                          }, ref) => {
    const id = useId();
    return (
        <input onChange={onChange}
               defaultValue={defaultValue}
               value={value}
               ref={ref}
               onKeyDown={onKeyDown}
               className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded text-xs py-2 px-4 leading-tight focus:outline-none focus:bg-white"
               name={name} id={id} type={type} placeholder={placeholder} min={min} max={max} required={required}/>
    );
})

InputDefault.displayName = 'InputDefault';

export default InputDefault;