"use client"
import {Eye, Trash} from "@/components/Icons";
import React, {Fragment, useEffect, useState} from "react";
import Link from "next/link";
import {ImportMaterialReceipt} from "@/models/Model";
import {deleteData, getData} from "@/services/APIService";
import {
    API_DELETE_IMPORT_MATERIAL_RECEIPT,
    API_GET_ALL_IMPORT_MATERIAL_RECEIPT,
    API_IMPORT_MATERIAL_RECEIPTS,
} from "@/config/api";
import DeleteModal from "@/components/Modal/DeleteModal";
import DeleteSuccessModal from "@/components/Modal/DeleteSuccessModal";
import SelectDefault, {Option} from "@/components/Inputs/SelectDefault";
import DropdownInput from "@/components/Inputs/DropdownInput";

const statusOptions : Option[] = [
    {
        key: "",
        value: "Tất cả loại"
    },
    {
        key: "NORMAL",
        value: "Thông thường"
    },
]

const filteredOptions : Option[] = [
    {
        key: "name",
        value: "Tên kho"
    },
]
const TableImportMaterial = () => {
    const [receipts, setReceipts] = useState<ImportMaterialReceipt[]>([]);
    const [receipt, setReceipt] = useState<ImportMaterialReceipt | null>();
    const [receiptToDeleted, setReceiptToDeleted] = useState<ImportMaterialReceipt | null>(null);
    const [isOpenDeleteModal, setIsOpenDeleteModal] = useState<boolean>(false);
    const [isOpenSuccessModal, setIsOpenSuccessModal] = useState<boolean>(false);

    const [statusOptionSelected, setStatusOptionSelected] = useState<string>('');
    const [showSearchProductModal, setShowSearchProductModal] = useState<boolean>(false);
    const [filteredOptionSelected, setFilteredOptionSelected] = useState<string>('name');

    const handleChangeStatusOption = (status: string) => {
        setStatusOptionSelected(status);
    }


    const handleChangeFilteredOption = (type: string) => {
        setFilteredOptionSelected(type);
    }

    const handleClickDeleteImportMaterialReceipt = (importMaterialReceipt: ImportMaterialReceipt) => {
        setReceipt(importMaterialReceipt);
        setIsOpenDeleteModal(true);
    }

    const handleDelete = async () => {
        await deleteData (API_DELETE_IMPORT_MATERIAL_RECEIPT + '/' + receipt?.id)
        setIsOpenDeleteModal(false);
        setIsOpenSuccessModal(true);
        getImportMaterialReceipts(API_GET_ALL_IMPORT_MATERIAL_RECEIPT);
    }

    const getImportMaterialReceipts = async (endpoint: string) => {
        const newImportMaterialReceipts : ImportMaterialReceipt[] = await getData(endpoint);
        setReceipts(newImportMaterialReceipts);
    }

    const handleCloseDeleteModal = () => {
        setIsOpenDeleteModal(false);
        setReceipt(null);
    }

    const handleResetFilters = () => {
        setStatusOptionSelected('');
    }

    const handleSearch = () => {
        let params : string = '';
        if (statusOptionSelected !== '') {
            params += '?type=' + statusOptionSelected;
        }
        getImportMaterialReceipts(API_IMPORT_MATERIAL_RECEIPTS + params);
    }

    useEffect(() => {
        getImportMaterialReceipts(API_IMPORT_MATERIAL_RECEIPTS)
    }, []);

    const columns : string[] = ["ID", "Kho", "Ngày nhận", "Tổng tiền", "Ghi chú", ""];
    return (
        <Fragment>
            {
                isOpenSuccessModal && <DeleteSuccessModal title="Thành công" message="Xóa xuất nguyên vật liệu thành công" onClose={() => setIsOpenSuccessModal(false)}/>
            }
            {
                isOpenDeleteModal && <DeleteModal title={`Xóa xuất nguyên vật liệu`} message={`Bạn chắc chắn muốn xóa xuất nguyên vật liệu ${receipt?.id}. Hành động này sẽ không thể hoàn tác`} onDelete={handleDelete} onClose={handleCloseDeleteModal}/>
            }
            <div
                className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                <div className="grid sm:grid-cols-12 gap-3 mb-5">

                    <div className="flex items-center"><label className="text-sm font-bold" htmlFor="searchStatus">Phân loại</label></div>
                    <div className="xsm:col-span-10 sm:col-span-5 flex flex-row items-center justify-center">
                        <SelectDefault options={statusOptions} id="searchStatus" onChange={handleChangeStatusOption}
                                       selectedValue={statusOptionSelected}/>
                    </div>

                    <div className="flex items-center"><label className="text-sm font-bold">Lọc</label></div>
                    <div className="xsm:col-span-10 sm:col-span-5 flex flex-row items-center justify-center">
                        <DropdownInput options={filteredOptions} onChangeDropdown={handleChangeFilteredOption}/>
                    </div>

                    <div className="col-span-full flex flex-row gap-3">
                        <button className="rounded px-4 py-2 text-white text-sm btn-blue" type="button"
                                onClick={handleSearch}>Tìm
                        </button>
                        <button className="btn-cancel rounded px-4 py-2 text-sm" type="button"
                                onClick={handleResetFilters}>Đặt lại
                        </button>
                    </div>
                </div>
                <div className="max-w-full overflow-x-auto">
                    <table className="w-full table-auto">
                        <thead>
                        <tr className="bg-gray-2 text-left text-xs dark:bg-meta-4 ">
                            <th className="min-w-[50px] px-2 py-2 font-medium text-black dark:text-white border-[#eee] border">
                                <div className="flex justify-center">
                                    <input type="checkbox"/>
                                </div>
                            </th>
                            {
                                columns.map((column: string, index: number) => (
                                    <th key={"columns-" + index}
                                        className="min-w-[50px] px-2 py-2 font-bold text-black dark:text-white border border-[#eee] text-center">
                                        {column}
                                    </th>
                                ))
                            }
                        </tr>
                        </thead>
                        <tbody className="text-left">
                        {receipts.map((importMaterialReceipt: ImportMaterialReceipt, key: number) => (
                            <tr key={key} className="text-xs">
                                <td className="border-b border-[#eee] px-2 py-3 dark:border-strokedark border-x">
                                    <div className="flex justify-center">
                                        <input type="checkbox"/>
                                    </div>
                                </td>
                                <td className="border border-[#eee] px-2 py-3 dark:border-strokedark">
                                    <p className="text-black dark:text-white text-center">
                                        {importMaterialReceipt.id}
                                    </p>
                                </td>
                                <td className="border border-[#eee] px-2 py-3 dark:border-strokedark">
                                    <h5 className="font-medium text-black dark:text-white">
                                        {importMaterialReceipt.warehouse.name}
                                    </h5>
                                </td>

                                <td className="border border-[#eee] px-2 py-3 dark:border-strokedark">
                                    <p className="text-black dark:text-white">
                                        {new Date(importMaterialReceipt.receipt_date).toLocaleString()}
                                    </p>
                                </td>
                                <td className="border-b border-[#eee] px-2 py-3 dark:border-strokedark border-l">
                                    <h5 className="font-medium text-black dark:text-white text-end">
                                        {new Intl.NumberFormat('vi-VN', {
                                            style: 'currency',
                                            currency: 'VND'
                                        }).format(importMaterialReceipt.total_price)}
                                    </h5>
                                </td>

                                <td className="border border-[#eee] px-2 py-3 dark:border-strokedark">
                                    <h5 className="font-medium text-black dark:text-white">
                                        {importMaterialReceipt.note}
                                    </h5>
                                </td>

                                <td className="border border-[#eee] px-2 py-3 dark:border-strokedark">
                                    <div className="flex items-center justify-center space-x-3.5">
                                        <Link href={`/import-materials/${importMaterialReceipt.id}`}
                                              className="hover:text-primary"><Eye/></Link>
                                        <button className="hover:text-primary" type="button"
                                                onClick={() => handleClickDeleteImportMaterialReceipt(importMaterialReceipt)}>
                                            <Trash/>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
                <div className="flex flex-row justify-between mt-4 mb-3">
                    <div>
                        <select
                            className="rounded bg-gray-50 text-xs py-2 px-2 font-bold focus:outline-none border border-gray-500 text-gray-600">
                            <option selected value={10}>Hiển thị 10</option>
                            <option value={20}>Hiển thị 20</option>
                            <option value={50}>Hiển thị 50</option>
                        </select>
                    </div>
                    <div className="flex gap-2">
                        <div>
                            <span className="text-xs">Tổng 100</span>
                        </div>
                        <ul>
                            <li className="border-[1px] border-gray-500 rounded">
                                <Link href="/" className="px-3 py-2">1</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default TableImportMaterial;
