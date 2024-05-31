import Link from "next/link";
import React from "react";

interface BreadcrumbProps {
    pageName: string;
    children?: React.ReactNode;
}

const Breadcrumb = ({pageName, children}: BreadcrumbProps) => {
    return (
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-title-sm font-semibold text-black dark:text-white">
                {pageName}
            </h2>
            {children}
        </div>
    );
};

export default Breadcrumb;