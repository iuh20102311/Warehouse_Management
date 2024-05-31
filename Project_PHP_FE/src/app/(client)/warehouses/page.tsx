"use client"
import React, {useRef, useState} from 'react';
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import {TableWarehouse} from "@/components/Tables";
import FolderUp from "@/components/Icons/FolderUp";
import Link from "next/link";
import {CirclePlus} from "@/components/Icons";
import {TableWarehouseHandle} from "@/components/Tables/TableWarehouse";
import ContainerModal from "@/components/Modal/ContainerModal";
import HeaderModal from "@/components/Modal/HeaderModal";
import BodyModal from "@/components/Modal/BodyModal";
import FooterModal from "@/components/Modal/FooterModal";

const WarehousePage = () => {
    const tableWarehouseRef = useRef<TableWarehouseHandle>();
    const [showExportModal, setShowExportModal] = useState<boolean>(false);
    const [exportType, setExportType] = useState<string>('FILTERED');
    const handleExport = () => {
        if (tableWarehouseRef.current) {
            tableWarehouseRef.current?.exportWarehouses(exportType);
            setShowExportModal(false);
        }
    }
    return (
        <DefaultLayout>
            {
                showExportModal && (
                    <ContainerModal>
                        <HeaderModal title="Xuất dữ liệu kho" onClose={() => setShowExportModal(false)}/>
                        <BodyModal>
                            <div className="flex items-center mb-4">
                                <input id="exportAll" type="radio" value="ALL" name="exportType" checked={exportType === 'ALL'} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setExportType(event.target.value)}
                                       className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"/>
                                <label htmlFor="exportAll"
                                       className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Tất cả kho</label>
                            </div>
                            <div className="flex items-center">
                                <input id="exportByFilter" type="radio" value="FILTERED" name="exportType" checked={exportType === 'FILTERED'} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setExportType(event.target.value)}
                                       className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"/>
                                <label htmlFor="exportByFilter"
                                       className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Theo bộ lọc hiện tại</label>
                            </div>
                        </BodyModal>
                        <FooterModal onClose={() => setShowExportModal(false)} disabledRightBtn={false}
                                     onClickRightBtn={handleExport} messageRightBtn="Xuất dữ liệu"/>
                    </ContainerModal>
                )
            }
            <Breadcrumb pageName="Danh sách kho">
                <div className="inline-flex gap-4">
                    <button className="btn btn-blue text-sm inline-flex items-center gap-2" type="button" onClick={() => setShowExportModal(true)}>
                        <FolderUp/>
                        <span className="hidden xl:block">Xuất Excel</span>
                    </button>
                    <Link href={"/warehouses/new"} className="btn btn-blue text-sm inline-flex items-center gap-2">
                        <CirclePlus/>
                        <span className="hidden xl:block">Thêm kho</span>
                    </Link>
                </div>
            </Breadcrumb>
            <TableWarehouse ref={tableWarehouseRef}/>
        </DefaultLayout>
    );
};

export default WarehousePage;