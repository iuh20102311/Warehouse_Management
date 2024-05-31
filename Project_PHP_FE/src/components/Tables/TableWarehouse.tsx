"use client"
import {Eye, Trash} from "@/components/Icons";
import React, {forwardRef, Fragment, useEffect, useImperativeHandle, useState} from "react";
import Link from "next/link";
import {Warehouse} from "@/models/Model";
import DeleteModal from "@/components/Modal/DeleteModal";
import {deleteData, getData} from "@/services/APIService";
import {API_DELETE_WAREHOUSE, API_GET_ALL_WAREHOUSES} from "@/config/api";
import DeleteSuccessModal from "@/components/Modal/DeleteSuccessModal";
import SelectDefault, {Option} from "@/components/Inputs/SelectDefault";
import DropdownInput from "@/components/Inputs/DropdownInput";
import * as XLSX from "xlsx";
import {toast} from "react-toastify";

const statusOptions: Option[] = [
    {
        key: "",
        value: "Tất cả trạng thái"
    },
    {
        key: "ENABLE",
        value: "Đang hoạt động"
    }
]

const filteredOptions: Option[] = [
    {
        key: "name",
        value: "Tên nhà kho"
    }
]

export type TableWarehouseHandle = {
    exportWarehouses: (type: string) => void;
}

const TableWarehouse = forwardRef((props, ref) => {
    const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
    const [warehouseToDeleted, setWarehouseToDeleted] = useState<Warehouse | null>(null);
    const [isOpenDeleteModal, setIsOpenDeleteModal] = useState<boolean>(false);
    const [isOpenSuccessModal, setIsOpenSuccessModal] = useState<boolean>(false);

    const [statusOptionSelected, setStatusOptionSelected] = useState<string>('');
    const [filteredOptionSelected, setFilteredOptionSelected] = useState<string>('name');
    const [searchValue, setSearchValue] = useState<string>("");


    useImperativeHandle(ref, () => ({
        exportWarehouses
    }));

    const formatDataForExport = (warehouses: Warehouse[]) => {
        return warehouses.map((warehouse) => ({
            ["Mã kho"]: warehouse.id,
            ["Tên kho"]: warehouse.name,
            ["Địa chỉ cụ thể"]: warehouse.address,
            ["Tỉnh/Thành phố"]: warehouse.city,
            ["Quận/Huyện"]: warehouse.district,
            ["Xã/Phường"]: warehouse.ward,
            ["Trạng thái"]: warehouse.status,
            ["Ghi chú"]: warehouse.note,
            ["Ngày tạo"]: new Date(warehouse.created_at).toLocaleString(),
            ["Ngày cập nhật"]: new Date(warehouse.updated_at).toLocaleString(),
        }));
    };

    const exportWarehouses = async (type: 'ALL' | 'FILTERED') => {
        try {
            let warehousesToExport: Warehouse[];
            if (type === 'ALL') {
                warehousesToExport = await getData(API_GET_ALL_WAREHOUSES);
            } else {
                warehousesToExport = warehouses;
            }
            const dataToExport = formatDataForExport(warehousesToExport);

            const workbook = XLSX.utils.book_new();
            const worksheet = XLSX.utils?.json_to_sheet(dataToExport);
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Kho');
            XLSX.writeFile(workbook, 'Kho.xlsx');
        } catch (error: any) {
            console.log(error);
            toast.error("Đã có lỗi xảy ra");
        }
    }


    const handleChangeStatusOption = (status: string) => {
        setStatusOptionSelected(status);
    }

    const handleChangeFilteredOption = (type: string) => {
        setFilteredOptionSelected(type);
    }

    const handleDelete = async () => {
        await deleteData(API_DELETE_WAREHOUSE + '/' + warehouseToDeleted?.id)
        setIsOpenDeleteModal(false);
        setIsOpenSuccessModal(true);
        getWarehouses(API_GET_ALL_WAREHOUSES);
    }

    const handleCloseDeleteModal = () => {
        setIsOpenDeleteModal(false);
        setWarehouseToDeleted(null);
    }

    const handleClickDeleteWarehouse = (warehouse: Warehouse) => {
        setWarehouseToDeleted(warehouse);
        setIsOpenDeleteModal(true);
    }

    const getWarehouses = async (endpoint: string) => {
        const newWarehouses: Warehouse[] = await getData(endpoint);
        setWarehouses(newWarehouses);
    }


    const handleResetFilters = () => {
        setStatusOptionSelected('');
        setFilteredOptionSelected('name');
        setSearchValue('');
        getWarehouses(API_GET_ALL_WAREHOUSES);
    }

    const handleSearch = () => {
        const params = new URLSearchParams();
        console.log(searchValue);
        if (statusOptionSelected !== '') {
            params.append('status', statusOptionSelected);
        }
        if (filteredOptionSelected !== '' && searchValue !== '') {
            params.append(filteredOptionSelected, searchValue);
        }
        console.log(`${API_GET_ALL_WAREHOUSES}?${params.toString()}`);
        getWarehouses(`${API_GET_ALL_WAREHOUSES}?${params.toString()}`);
    }

    useEffect(() => {
        getWarehouses(API_GET_ALL_WAREHOUSES)
    }, []);

    const columns: string[] = ["ID", "Tên", "Địa chỉ", "Trạng thái", "Thời gian hoạt động", "Ghi chú", ""];
    return (
        <Fragment>
            {
                isOpenSuccessModal && <DeleteSuccessModal title="Thành công" message="Xóa sản phẩm thành công"
                                                          onClose={() => setIsOpenSuccessModal(false)}/>
            }
            {
                isOpenDeleteModal && <DeleteModal title={`Xóa sản phẩm`}
                                                  message={`Bạn chắc chắn muốn xóa sản phẩm ${warehouseToDeleted?.id} - ${warehouseToDeleted?.name} - ${warehouseToDeleted?.address}. Hành động này sẽ không thể hoàn tác`}
                                                  onDelete={handleDelete} onClose={handleCloseDeleteModal}/>
            }
            <div
                className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                <div className="grid sm:grid-cols-12 gap-3 mb-5">

                    <div className="flex items-center"><label className="text-sm font-bold">Lọc</label></div>
                    <div className="xsm:col-span-10 sm:col-span-5 flex flex-row items-center justify-center">
                        <DropdownInput options={filteredOptions} onChangeDropdown={handleChangeFilteredOption}
                                       selectedValue={filteredOptionSelected} inputSearchValue={searchValue}
                                       onChangeInputSearch={(event: React.ChangeEvent<HTMLInputElement>) => setSearchValue(event.target.value)}/>
                    </div>

                    <div className="flex items-center"><label className="text-sm font-bold" htmlFor="searchStatus">Trạng
                        thái</label></div>
                    <div className="xsm:col-span-10 sm:col-span-5 flex flex-row items-center justify-center">
                        <SelectDefault options={statusOptions} id="searchStatus" onChange={handleChangeStatusOption}
                                       selectedValue={statusOptionSelected}/>
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
                        <tr className="bg-gray-2 text-left text-xs dark:bg-meta-4">
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
                        {warehouses.map((warehouses: Warehouse, key: number) => (
                            <tr key={key} className="text-xs">
                                <td className="border-b border-[#eee] px-2 py-3 dark:border-strokedark border-x">
                                    <div className="flex justify-center">
                                        <input type="checkbox"/>
                                    </div>
                                </td>
                                <td className="border border-[#eee] px-2 py-3 dark:border-strokedark">
                                    <p className="text-black dark:text-white text-center">
                                        {warehouses.id}
                                    </p>
                                </td>
                                <td className="border border-[#eee] px-2 py-3 dark:border-strokedark">
                                    <p className="text-black dark:text-white">
                                        {warehouses.name}
                                    </p>
                                </td>
                                <td className="border border-[#eee] px-2 py-3 dark:border-strokedark">
                                    <p className="text-black dark:text-white">
                                        {warehouses.address}, {warehouses.ward}, {warehouses.district}, {warehouses.city}
                                    </p>
                                </td>
                                <td className="border border-[#eee] px-2 py-3 dark:border-strokedark">
                                    <p
                                        className={`inline-flex rounded-full bg-opacity-10 px-3 py-1 font-medium text-xs ${
                                            warehouses.status === "ENABLE"
                                                ? "bg-success text-success"
                                                : warehouses.status === "TEMPORARILY_SUSPENDED"
                                                    ? "bg-danger text-danger"
                                                    : "bg-warning text-warning"
                                        }`}
                                    >
                                        {
                                            warehouses.status === "ENABLE" ? "Đang hoạt động" : (warehouses.status === "TEMPORARILY_SUSPENDED" ? "Tạm ngưng" : "Không hoạt động")
                                        }
                                    </p>
                                </td>
                                <td className="border border-[#eee] px-2 py-3 dark:border-strokedark">
                                    <p className="text-black dark:text-white">
                                        {new Date(warehouses.created_at).toLocaleString()}
                                    </p>
                                </td>
                                <td className="border border-[#eee] px-2 py-3 dark:border-strokedark">
                                    <p className="text-black dark:text-white">
                                        {warehouses.note}
                                    </p>
                                </td>
                                <td className="border border-[#eee] px-2 py-3 dark:border-strokedark">
                                    <div className="flex items-center space-x-3.5 justify-center">
                                        <Link href={`/warehouses/${warehouses.id}`}
                                              className="hover:text-primary"><Eye/></Link>
                                        <button className="hover:text-primary" type="button"
                                                onClick={() => handleClickDeleteWarehouse(warehouses)}><Trash/></button>
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
                            className="rounded bg-gray-50 text-xs py-2 px-2 font-bold focus:outline-none border border-gray-500 text-gray-600" defaultValue={10}>
                            <option value={10}>Hiển thị 10</option>
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
});

TableWarehouse.displayName = 'TableWarehouse';

export default TableWarehouse;
