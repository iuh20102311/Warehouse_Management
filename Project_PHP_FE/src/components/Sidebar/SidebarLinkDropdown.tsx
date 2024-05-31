import React from "react";
import SidebarLinkGroup from "./SidebarLinkGroup";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarLinkDropdownProps {
    icon: any;
    category: any;
    sidebarExpanded: any;
    setSidebarExpanded: any;
}

const SidebarLinkDropdown = ({ icon, category, sidebarExpanded, setSidebarExpanded }: SidebarLinkDropdownProps) => {
    const pathname = usePathname();
    return (
        <SidebarLinkGroup
            activeCondition={
                pathname === "/" + category.path || (pathname.startsWith("/" + category.path) && pathname.split("/")[1] === category.path.split("/")[0])
            }
        >
            {(handleClick, open) => {
                return (
                    <React.Fragment>
                        <Link
                            href="#"
                            className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 text-sm font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${(pathname === "/" + category.path ||
                                (pathname.startsWith("/" + category.path) && pathname.split("/")[1] === category.path.split("/")[0])) &&
                                "bg-graydark dark:bg-meta-4"
                                }`}
                            onClick={(e) => {
                                e.preventDefault();
                                sidebarExpanded
                                    ? handleClick()
                                    : setSidebarExpanded(true);
                            }}
                        >
                            {icon}
                            {category.name}
                            <svg
                                className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${open && "rotate-180"
                                    }`}
                                width="20"
                                height="20"
                                viewBox="0 0 20 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                                    fill=""
                                />
                            </svg>
                        </Link>
                        {/* <!-- Dropdown Menu Start --> */}
                        <div
                            className={`translate transform overflow-hidden ${!open && "hidden"
                                }`}
                        >
                            <ul className="mb-5.5 mt-4 flex flex-col gap-2.5 pl-6">
                                {
                                    category.sub.map((item: any, index: any) => (
                                        <li key={index}>
                                            <Link
                                                href={`/${item.path}`}
                                                className={`group relative text-sm flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${pathname === "/" + item.path && "text-white"
                                                    }`}
                                            >
                                                {item.name}
                                            </Link>
                                        </li>
                                    ))
                                }

                            </ul>
                        </div>
                        {/* <!-- Dropdown Menu End --> */}
                    </React.Fragment>
                );
            }}
        </SidebarLinkGroup>
    );
}
export default SidebarLinkDropdown;