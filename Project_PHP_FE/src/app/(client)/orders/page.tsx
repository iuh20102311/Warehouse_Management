import React from 'react';
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import {TableOrder, TableProduct} from "@/components/Tables";
import FolderUp from "@/components/Icons/FolderUp";
import Link from "next/link";
import {CirclePlus} from "@/components/Icons";

const   OrderPage = () => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Danh sách đơn hàng">
                <div className="inline-flex gap-4">
                    <Link href={"/orders/new"} className="btn btn-blue text-sm inline-flex items-center gap-2">
                        <CirclePlus/>
                        <span className="hidden xl:block">Tạo đơn hàng</span>
                    </Link>
                </div>
            </Breadcrumb>
            <TableOrder/>
        </DefaultLayout>
    );
};

export default OrderPage;