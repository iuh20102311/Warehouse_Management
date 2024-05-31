import React from 'react';
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import {TableDiscount} from "@/components/Tables";
import FolderUp from "@/components/Icons/FolderUp";
import Link from "next/link";
import {CirclePlus} from "@/components/Icons";

const OrderPage = () => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Danh sách khuyến mãi">
                <div className="inline-flex gap-4">
                    <button className="btn btn-blue text-sm inline-flex items-center gap-2">
                        <FolderUp/>
                        <span className="hidden xl:block">Xuất Excel</span>
                    </button>
                    <Link href={"/discounts/new"} className="btn btn-blue text-sm inline-flex items-center gap-2">
                        <CirclePlus/>
                        <span className="hidden xl:block">Thêm khuyến mãi</span>
                    </Link>
                </div>
            </Breadcrumb>
            <TableDiscount/>
        </DefaultLayout>
    );
};

export default OrderPage;