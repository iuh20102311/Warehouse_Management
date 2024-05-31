import React, {FC, ReactNode} from 'react';

interface TooltipProps {
    children: ReactNode;
    message: string;
}

const Tooltip: FC<TooltipProps> = ({children, message}): React.JSX.Element => {
    return (
        // <div
        //     className="relative
        //     w-fit
        //     before:content-[attr(data-tip)]
        //     before:absolute before:px-3
        //     before:py-2 before:left-1/2
        //     before:-top-3 before:w-max
        //     before:text-xs
        //     before:max-w-xs before:-translate-x-1/2
        //     before:-translate-y-full
        //     before:bg-body before:text-white
        //     before:rounded before:opacity-0
        //     before:transition-all
        //     after:absolute
        //     after:left-1/2 after:-top-3
        //     after:h-0 after:w-0
        //     after:-translate-x-1/2
        //     after:border-8 after:border-t-body
        //     after:border-l-transparent
        //     after:border-b-transparent
        //     after:border-r-transparent
        //     after:opacity-0 after:transition-all
        //     hover:before:opacity-100
        //     hover:after:opacity-100"
        //     data-tip={message}
        // >
        //     {children}
        // </div>

        <div
            className="relative
            w-fit
            before:content-[attr(data-tip)]
            before:absolute before:px-3
            before:py-2 before:top-1/2
            before:-right-3 before:w-max
            before:text-xs
            before:max-w-xs before:translate-x-full
            before:-translate-y-1/2
            before:bg-body before:text-white
            before:rounded before:opacity-0
            before:transition-all
            before:duration-300

            after:absolute
            after:top-1/2 after:-right-3
            after:h-0 after:w-0
            after:-translate-y-1/2
            after:translate-x-0
            after:border-8 after:border-r-body
            after:border-t-transparent
            after:border-l-transparent
            after:border-b-transparent
            after:opacity-0 after:transition-all
            after:duration-300
            hover:before:opacity-100
            hover:after:opacity-100"
            data-tip={message}
        >
            {children}
        </div>
    );
};

export default Tooltip;