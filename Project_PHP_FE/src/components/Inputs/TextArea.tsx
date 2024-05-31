import React, {useId} from 'react';

interface TextAreaProps {
    label: string;
    feedback: string;
    placeholder: string;
    name: string;
    error?: boolean;
    required?: boolean;
    defaultValue?: string | number | readonly string[] | undefined;

}
const TextArea = ({label, feedback, placeholder, name, error = false, required=false, defaultValue}:TextAreaProps) => {
    const id:string = useId();
    return (
        <div className="w-full mb-6">
            <label className="block tracking-wide text-gray-700 text-sm font-bold mb-2"
                   htmlFor={id}>
                {label}
            </label>
            <textarea
                defaultValue={defaultValue}
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded text-xs py-2 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                name={name} id={id} placeholder={placeholder} required={required} rows={6}/>
            <p className={`text-red-500 text-xs italic text-danger ${error ? "block" : "hidden"}`}>{feedback}</p>
        </div>
    );
};

export default TextArea;