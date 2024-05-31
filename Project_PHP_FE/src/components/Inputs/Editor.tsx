import React, {createRef, LegacyRef, useMemo, useRef} from 'react';
import dynamic from 'next/dynamic';
import {Jodit} from "jodit-react";

interface EditorProps {
    placeholder: string;
    content: string;
    setContent: React.Dispatch<React.SetStateAction<string>>;
}

const JoditEditor = dynamic(() => import('jodit-react'), {ssr: false});
const Editor = ({placeholder, content = "", setContent}: EditorProps) => {
    const editor = useRef<Jodit>(null);
    const config = useMemo(() => ({
        readonly: false,
        placeholder: placeholder,
        addNewLine: false,
    }), []);

    return (
        <JoditEditor
            value={content}
            ref={editor}
            config={config}
            onBlur={(newContent: string) => setContent(newContent)}
            onChange={(newContent: string) => {}}
        />
    );
}

export default Editor;