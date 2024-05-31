import React from 'react';
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Link from "next/link";
import {CirclePlus} from "@/components/Icons";
import TableImportProduct from "@/components/Tables/TableImportProduct";

const ImportProductPage = () => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Danh sách nhập kho thành phẩm">
                <div className="inline-flex gap-4">
                    <Link href={"/receipts/import-products/new"} className="btn btn-blue text-sm inline-flex items-center gap-2">
                        <CirclePlus/>
                        <span className="hidden xl:block">Tạo phiếu nhập kho</span>
                    </Link>
                </div>
            </Breadcrumb>
            <TableImportProduct/>
        </DefaultLayout>
    );
};

export default ImportProductPage;