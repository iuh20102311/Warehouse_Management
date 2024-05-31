"use client"
import React, {forwardRef, Fragment, useEffect, useImperativeHandle, useState} from "react";
import Link from "next/link";
import {getData} from "@/services/APIService";
import {API_GET_ALL_INVENTORY_MATERIALS, API_GET_ALL_WAREHOUSES,} from "@/config/api";
import SelectDefault, {Option} from "@/components/Inputs/SelectDefault";
import Image from "next/image";
import {InventoryMaterial} from "@/models/Material";
import {Warehouse} from "@/models/Model";
import * as XLSX from "xlsx";
import {toast} from "react-toastify";

export type TableInventoryMaterialHandle = {
    exportInventoryMaterials: (type: string) => void;
}

const TableInventoryMaterial = forwardRef((props, ref) => {
    const [inventories, setInventories] = useState<InventoryMaterial[]>([]);

    const [warehouseOptions, setWarehouseOptions] = useState<Option[]>([{key: "", value: "Tất cả"}])
    const [warehouseSelected, setWarehouseSelected] = useState<string>("")

    const handleChangeWarehouseOption = (warehouse: string) => {
        setWarehouseSelected(warehouse);
    }

    const getAllWarehouses = async () => {
        const data : Warehouse[] = await getData(API_GET_ALL_WAREHOUSES);
        const options : Option[] = data.map(warehouse => ({
            key: warehouse.id.toString(),
            value: `${warehouse.id} - ${warehouse.name}`
        }));
        options.unshift({ key: "", value: "Tất cả" });
        setWarehouseSelected(options[0].key);
        setWarehouseOptions(options);
    }

    useEffect(() => {
        getAllWarehouses();
    }, []);


    useImperativeHandle(ref, () => ({
        exportInventoryMaterials
    }));

    const formatDataForExport = (inventories: InventoryMaterial[]) => {
        return inventories.map((inventory) => ({
            ["ID"]: inventory.Material.id,
            ["Tên vật liệu"]: inventory.Material.name,
            ["Đơn vị"]: inventory.Material.unit,
            ["Xuất xứ"]: inventory.Material.origin,
            ["Tổng tồn kho"]: inventory.Material.quantity,
            ["Trọng lượng"]: inventory.Material.weight,
            ["Trạng thái"]: inventory.Material.status,
            ["Mã kho"]: inventory.warehouse.id,
            ["Tên kho"]: inventory.warehouse.name,
            ["Địa chỉ"]: inventory.warehouse.address,
            ["Tỉnh/Thành phố"]: inventory.warehouse.city,
            ["Quận/Huyện"]: inventory.warehouse.district,
            ["Xã/Phường"]: inventory.warehouse.ward,
            ["Số lượng trong kho hiện tại"]: inventory.quantity_available,
            ["Ngày tạo"]: new Date(inventory.created_at).toLocaleString(),
            ["Ngày cập nhật"]: new Date(inventory.updated_at).toLocaleString(),
        }));
    };

    const exportInventoryMaterials = async (type: 'ALL' | 'FILTERED') => {
        try {
            let inventoriesToExport: InventoryMaterial[];
            if (type === 'ALL') {
                inventoriesToExport = await getData(API_GET_ALL_INVENTORY_MATERIALS);
            } else {
                inventoriesToExport = inventories;
            }
            const dataToExport = formatDataForExport(inventoriesToExport);

            const workbook = XLSX.utils.book_new();
            const worksheet = XLSX.utils?.json_to_sheet(dataToExport);
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Tồn kho nguyên vật liệu');
            XLSX.writeFile(workbook, 'Tồn kho nguyên vật liệu.xlsx');
        } catch (error: any) {
            console.log(error);
            toast.error("Đã có lỗi xảy ra");
        }
    }

    const getInventories = async (endpoint: string) => {
        const newInventories : InventoryMaterial[] = await getData(endpoint);
        setInventories(newInventories);
    }

    const handleResetFilters = () => {
        setWarehouseSelected('');
        getInventories(API_GET_ALL_INVENTORY_MATERIALS)
    }

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (warehouseSelected !== '') {
            params.append('warehouse_id', warehouseSelected);
            console.log(warehouseSelected);
        }
        getInventories(`${API_GET_ALL_INVENTORY_MATERIALS}?${params.toString()}`);
    }

    useEffect(() => {
        getInventories(API_GET_ALL_INVENTORY_MATERIALS)
    }, []);

    const columns : string[] = ["ID", "Nguyên liệu", "Kho", "Số lượng tồn kho", "Tổng tồn kho của tất cả kho","Số lượng lưu kho tối thiểu"];
    return (
        <Fragment>
            <div
                className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                <div className="grid sm:grid-cols-12 gap-3 mb-5">
                    <div className="flex items-center"><label className="text-sm font-bold" htmlFor="searchStatus">Kho</label></div>
                    <div className="xsm:col-span-10 sm:col-span-5 flex flex-row items-center justify-center">
                        <SelectDefault options={warehouseOptions} id="searchStatus" onChange={handleChangeWarehouseOption}
                                       selectedValue={warehouseSelected}/>
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
                        {inventories.map((inventory: InventoryMaterial, key: number) => (
                            <tr key={key} className="text-xs">
                                <td className="border border-[#eee] px-2 py-3 dark:border-strokedark">
                                    <p className="text-black dark:text-white text-center">
                                        {inventory.id}
                                    </p>
                                </td>
                                <td className="border border-[#eee] px-2 py-3 dark:border-strokedark">
                                    <div className="flex flex-row gap-2">
                                        <div>
                                            <Image src={"/images/default/no-image.png"} alt=""
                                                   width={50}
                                                   height={50}
                                                   className="rounded border border-opacity-30 aspect-square object-cover"/>
                                        </div>
                                        <div>
                                            <a href={`/materials/${inventory.Material.id}`} target="_blank"
                                               className="font-bold text-sm text-blue-600 block mb-1">{inventory.Material?.name}</a>
                                            <div>SKU: {inventory.Material?.id}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="border border-[#eee] px-2 py-3 dark:border-strokedark">
                                    <h5 className="font-medium text-black dark:text-white">
                                        {`${inventory.warehouse.id} - ${inventory.warehouse.name}`}
                                    </h5>
                                </td>
                                <td className="border border-[#eee] px-2 py-3 dark:border-strokedark text-end">
                                    <h5 className="font-medium text-black dark:text-white">
                                        {inventory.quantity_available}
                                    </h5>
                                </td>
                                <td className="border border-[#eee] px-2 py-3 dark:border-strokedark text-end">
                                    <h5 className="font-medium text-black dark:text-white">
                                        {inventory.Material.quantity}
                                    </h5>
                                </td>

                                <td className="border border-[#eee] px-2 py-3 dark:border-strokedark text-end">
                                    <p className="text-black dark:text-white">
                                        {inventory.minimum_stock_level}
                                    </p>
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

TableInventoryMaterial.displayName = 'TableInventoryMaterial';

export default TableInventoryMaterial;
