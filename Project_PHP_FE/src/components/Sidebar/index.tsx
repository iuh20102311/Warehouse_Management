"use client";
import Image from "next/image";
import Link from "next/link";
import {usePathname} from "next/navigation";
import React, {useEffect, useRef, useState} from "react";
import {DashboardIcon} from "./SidebarIcons";
import SidebarLink from "./SidebarLink";
import SidebarLinkDropdown from "./SidebarLinkDropdown";
import {
    TickerPercent,
    ShoppingCart,
    Tag,
    BookUser,
    BaggageClaim,
    Warehouse,
    Fence,
    PackageSearch, LayoutGird, ContactEmployee
} from "@/components/Icons";
import {List} from "postcss/lib/list";
import SquareGanttChart from "@/components/Icons/SquareGanttChart";


interface SidebarProps {
    sidebarOpen: boolean;
    setSidebarOpen: (arg: boolean) => void;
}

interface Category {
    name: string,
    path: string,
    icon?: JSX.Element | Element;
    sub?: SubCategory[];
}

interface SubCategory {
    name: string,
    path: string,
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
    const categories : Category[] = [
        {
            name: "Trang chủ",
            path: "",
            icon: <LayoutGird/>,
        },
        {
            name: "Đơn hàng",
            path: "orders",
            icon: <ShoppingCart/>,
            sub: [
                {
                    name: "Tất cả đơn hàng",
                    path: "orders"
                },
                {
                    name: "Tạo đơn nháp",
                    path: "add"
                },
            ]
        },
        {
            name: "Sản phẩm",
            path: "products",
            icon: <Tag/>,
            sub: [
                {
                    name: "Tất cả sản phẩm",
                    path: "products"
                },
                {
                    name: "Danh mục",
                    path: "categories"
                }
            ]
        },
        {
            name: "Nguyên vật liệu",
            path: "materials",
            icon: <PackageSearch/>,
        },
        {
            name: "Nhà cung cấp",
            path: "providers",
            icon: <BaggageClaim/>,
        },
        {
            name: "Xuất - Nhập kho",
            path: "receipts",
            icon: <Fence/>,
            sub: [
                {
                    name: "Nhập kho nguyên vật liệu",
                    path: "receipts/import-materials"
                },
                {
                    name: "Xuất kho nguyên vật liệu",
                    path: "receipts/export-materials"
                },
                {
                    name: "Nhập kho thành phẩm",
                    path: "receipts/import-products"
                },
                {
                    name: "Xuất kho thành phẩm",
                    path: "receipts/export-products"
                },
            ]
        },
        {
            name: "Tồn kho",
            path: "inventories",
            icon: <SquareGanttChart/>,
            sub: [
                {
                    name: "Tồn kho sản phẩm",
                    path: "inventories/products"
                },
                {
                    name: "Tồn kho nguyên vật liệu",
                    path: "inventories/materials"
                }
            ]
        },
        {
            name: "Nhân viên",
            path: "employee",
            icon: <ContactEmployee/>
        },
        {
            name: "Khách hàng",
            path: "customers",
            icon: <BookUser/>
        },
        {
            name: "Khuyến mãi",
            path: "discounts",
            icon: <TickerPercent/>,
        },
        {
            name: "Kho",
            path: "warehouses",
            icon: <Warehouse/>
        },
    ]

    const trigger = useRef<any>(null);
    const sidebar = useRef<any>(null);

    let storedSidebarExpanded = "true";

    const [sidebarExpanded, setSidebarExpanded] = useState(
        storedSidebarExpanded === null ? false : storedSidebarExpanded === "true",
    );

    // close on click outside
    useEffect(() => {
        const clickHandler = ({ target }: MouseEvent) => {
            if (!sidebar.current || !trigger.current) return;
            if (
                !sidebarOpen ||
                sidebar.current.contains(target) ||
                trigger.current.contains(target)
            )
                return;
            setSidebarOpen(false);
        };
        document.addEventListener("click", clickHandler);
        return () => document.removeEventListener("click", clickHandler);
    });

    // close if the esc key is pressed
    useEffect(() => {
        const keyHandler = ({ key }: KeyboardEvent) => {
            if (!sidebarOpen || key !== "Escape") return;
            setSidebarOpen(false);
        };
        document.addEventListener("keydown", keyHandler);
        return () => document.removeEventListener("keydown", keyHandler);
    });

    useEffect(() => {
        localStorage.setItem("sidebar-expanded", sidebarExpanded.toString());
        if (sidebarExpanded) {
            document.querySelector("body")?.classList.add("sidebar-expanded");
        } else {
            document.querySelector("body")?.classList.remove("sidebar-expanded");
        }
    }, [sidebarExpanded]);

    return (
        <aside
            ref={sidebar}
            className={`absolute left-0 top-0 flex h-screen w-60 flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
                }`}
        >
            {/* Sidebar Header Start */}
            <div className="flex items-center justify-between gap-2 px-4 py-5.5 lg:py-6.5">
                <Link href="/">
                    <Image
                        width={176}
                        height={38}
                        src={"/images/logo/logo_test1.png"}
                        alt="Logo"
                        priority
                    />
                </Link>

                <button
                    ref={trigger}
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    aria-controls="sidebar"
                    aria-expanded={sidebarOpen}
                    className="block lg:hidden"
                >
                    <svg
                        className="fill-current"
                        width="20"
                        height="18"
                        viewBox="0 0 20 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
                            fill=""
                        />
                    </svg>
                </button>
            </div>
            {/* Sidebar Header End */}

            {/* Menu Start  */}
            <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
                <nav className="mt-2 py-3 lg:mt-5">
                    {/* Menu Group Start*/}
                    <div>
                        <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2"> MENU </h3>

                        <ul className="mb-6 flex flex-col gap-1">
                            {
                                categories.map((category: Category, index: number) => (
                                    <div key={index}>
                                        {
                                            category.sub ? (
                                                <SidebarLinkDropdown icon={category.icon} category={category} sidebarExpanded={sidebarExpanded} setSidebarExpanded={setSidebarExpanded} />
                                            ) : (
                                                <SidebarLink icon={category.icon} path={category.path} name={category.name} />
                                            )
                                        }
                                    </div>
                                ))
                            }
                        </ul>



                    </div>
                    {/* Menu Group End */}
                </nav>
            </div>
            {/* Menu End */}
        </aside>

    )

}
export default Sidebar;

