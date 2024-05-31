"use client"
import {Eye, Trash} from "@/components/Icons";
import React, {forwardRef, Fragment, useEffect, useImperativeHandle, useState} from "react";
import Link from "next/link";
import {Material} from "@/models/Model";
import {deleteData, getData} from "@/services/APIService";
import {API_DELETE_MATERIAL, API_GET_ALL_MATERIALS} from "@/config/api";
import DeleteModal from "@/components/Modal/DeleteModal";
import DeleteSuccessModal from "@/components/Modal/DeleteSuccessModal";
import SelectDefault, {Option} from "@/components/Inputs/SelectDefault";
import DropdownInput from "@/components/Inputs/DropdownInput";
import Image from "next/image";
import * as XLSX from "xlsx";
import {toast} from "react-toastify";

const statusOptions: Option[] = [
    {
        key: "",
        value: "Tất cả trạng thái"
    },
    {
        key: "IN_STOCK",
        value: "Đang bán"
    },
    {
        key: "OUT_OF_STOCK",
        value: "Hết hàng"
    },
    {
        key: "TEMPORARILY_SUSPENDED",
        value: "Tạm ngưng"
    },
]

const filteredOptions: Option[] = [
    {
        key: "name",
        value: "Tên nguyên liệu"
    },
]

export type TableMaterialHandle = {
    exportMaterials: (type: string) => void;
}

const TableMaterial = forwardRef((props, ref) => {
    const [materials, setMaterials] = useState<Material[]>([]);
    const [materialToDeleted, setMaterialToDeleted] = useState<Material | null>(null);
    const [isOpenDeleteModal, setIsOpenDeleteModal] = useState<boolean>(false);
    const [isOpenSuccessModal, setIsOpenSuccessModal] = useState<boolean>(false);

    const [statusOptionSelected, setStatusOptionSelected] = useState<string>('');
    const [filteredOptionSelected, setFilteredOptionSelected] = useState<string>('name');
    const [searchValue, setSearchValue] = useState<string>("");

    useImperativeHandle(ref, () => ({
        exportMaterials
    }));

    const formatDataForExport = (materials: Material[]) => {
        return materials.map((material) => ({
            ["Mã nguyên liệu"]: material.id,
            ["Tên nguyên liệu"]: material.name,
            ["Xuất xứ"]: material.origin,
            ["Đơn vị"]: material.unit,
            ["Tồn kho"]: material.quantity,
            ["Trọng lượng"]: material.weight,
            ["Trạng thái"]: material.status,
            ["Ghi chú"]: material.note,
            ["Ngày tạo"]: new Date(material.created_at).toLocaleString(),
            ["Ngày cập nhật"]: new Date(material.updated_at).toLocaleString(),
        }));
    };

    const exportMaterials = async (type: 'ALL' | 'FILTERED') => {
        try {
            let materialsToExport: Material[];
            if (type === 'ALL') {
                materialsToExport = await getData(API_GET_ALL_MATERIALS);
            } else {
                materialsToExport = materials;
            }
            const dataToExport = formatDataForExport(materialsToExport);

            const workbook = XLSX.utils.book_new();
            const worksheet = XLSX.utils?.json_to_sheet(dataToExport);
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Nguyên vật liệu');
            XLSX.writeFile(workbook, 'Nguyên vật liệu.xlsx');
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

    const handleClickDeleteMaterial = (material: Material) => {
        setMaterialToDeleted(material);
        setIsOpenDeleteModal(true);
    }

    const handleDelete = async () => {
        await deleteData(API_DELETE_MATERIAL + '/' + materialToDeleted?.id)
        setIsOpenDeleteModal(false);
        setIsOpenSuccessModal(true);
        getMaterials(API_GET_ALL_MATERIALS);
    }

    const getMaterials = async (endpoint: string) => {
        const newMaterials: Material[] = await getData(endpoint);
        setMaterials(newMaterials);
    }

    const handleCloseDeleteModal = () => {
        setIsOpenDeleteModal(false);
        setMaterialToDeleted(null);
    }

    const handleResetFilters = () => {
        setStatusOptionSelected('');
        setFilteredOptionSelected('name');
        setSearchValue('');
        getMaterials(API_GET_ALL_MATERIALS)
    }

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (statusOptionSelected !== '') {
            params.append('status', statusOptionSelected);
        }
        if (filteredOptionSelected !== '' && searchValue !== '') {
            params.append(filteredOptionSelected, searchValue);
        }
        getMaterials(`${API_GET_ALL_MATERIALS}?${params.toString()}`);
    }
    useEffect(() => {
        getMaterials(API_GET_ALL_MATERIALS)
    }, []);

    const columns: string[] = ["Hình ảnh", "ID", "Tên", "Khối lượng", "Số lượng", "Trạng thái", "Ghi chú", "Thời gian cập nhật", ""];
    return (
        <Fragment>
            {
                isOpenSuccessModal && <DeleteSuccessModal title="Thành công" message="Xóa nguyên vật liệu thành công"
                                                          onClose={() => setIsOpenSuccessModal(false)}/>
            }
            {
                isOpenDeleteModal && <DeleteModal title={`Xóa nguyên vật liệu`}
                                                  message={`Bạn chắc chắn muốn xóa nguyên vật liệu ${materialToDeleted?.id} - ${materialToDeleted?.name}. Hành động này sẽ không thể hoàn tác`}
                                                  onDelete={handleDelete} onClose={handleCloseDeleteModal}/>
            }
            <div
                className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                <div className="grid sm:grid-cols-12 gap-3 mb-5">

                    <div className="flex items-center"><label className="text-sm font-bold" htmlFor="searchStatus">Trạng
                        thái</label></div>
                    <div className="xsm:col-span-10 sm:col-span-5 flex flex-row items-center justify-center">
                        <SelectDefault options={statusOptions} id="searchStatus" onChange={handleChangeStatusOption}
                                       selectedValue={statusOptionSelected}/>
                    </div>

                    <div className="flex items-center"><label className="text-sm font-bold">Lọc</label></div>
                    <div className="xsm:col-span-10 sm:col-span-5 flex flex-row items-center justify-center">
                        <DropdownInput options={filteredOptions} selectedValue={filteredOptionSelected}
                                       onChangeDropdown={handleChangeFilteredOption} inputSearchValue={searchValue}
                                       onChangeInputSearch={(event: React.ChangeEvent<HTMLInputElement>) => setSearchValue(event.target.value)}/>
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
                        {materials.map((material: Material, key: number) => (
                            <tr key={key} className="text-xs">
                                <td className="border-b border-[#eee] px-2 py-3 dark:border-strokedark border-x">
                                    <div className="flex justify-center">
                                        <input type="checkbox"/>
                                    </div>
                                </td>
                                <td className="border-b border-[#eee] px-2 py-3 dark:border-strokedark border-l">
                                    <div className="flex justify-center">
                                        <Image src={"/images/default/no-image.png"} alt="" width={50}
                                               height={50}
                                               className="rounded border border-opacity-30 aspect-square object-cover"/>
                                    </div>
                                </td>
                                <td className="border border-[#eee] px-2 py-3 dark:border-strokedark">
                                    <p className="text-black dark:text-white text-center">
                                        {material.id}
                                    </p>
                                </td>
                                <td className="border border-[#eee] px-2 py-3 dark:border-strokedark">
                                    <h5 className="font-medium text-black dark:text-white">
                                        {material.name}
                                    </h5>
                                    <p className="text-xs">{material.origin}</p>
                                </td>

                                <td className="border border-[#eee] px-2 py-3 dark:border-strokedark">
                                    <h5 className="font-medium text-black dark:text-white text-end">
                                        {material.weight} kg
                                    </h5>
                                </td>
                                <td className="border border-[#eee] px-2 py-3 dark:border-strokedark">
                                    <h5 className="font-medium text-black dark:text-white text-end">
                                        {material.quantity + " " + material.unit}
                                    </h5>
                                </td>

                                <td className="border border-[#eee] px-2 py-3 dark:border-strokedark">
                                    <p
                                        className={`inline-flex rounded-full bg-opacity-10 px-3 py-1 font-medium text-xs ${
                                            material.status === "IN_STOCK"
                                                ? "bg-success text-success"
                                                : material.status === "TEMPORARILY_SUSPENDED"
                                                    ? "bg-danger text-danger"
                                                    : "bg-warning text-warning"
                                        }`}
                                    >
                                        {
                                            material.status === "IN_STOCK" ? "Đang bán" : material.status === "TEMPORARILY_SUSPENDED" ? "Tạm ngưng" : "Hết hàng"
                                        }
                                    </p>
                                </td>
                                <td className="border border-[#eee] px-2 py-3 dark:border-strokedark">
                                    <h5 className="font-medium text-black dark:text-white">
                                        {material.note}
                                    </h5>
                                </td>
                                <td className="border border-[#eee] px-2 py-3 dark:border-strokedark">
                                    <p className="text-black dark:text-white">
                                        {new Date(material.updated_at).toLocaleString()}
                                    </p>
                                </td>
                                <td className="border border-[#eee] px-2 py-3 dark:border-strokedark">
                                    <div className="flex items-center justify-center space-x-3.5">
                                        <Link href={`/materials/${material.id}`}
                                              className="hover:text-primary"><Eye/></Link>
                                        <button className="hover:text-primary" type="button"
                                                onClick={() => handleClickDeleteMaterial(material)}><Trash/></button>
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
});

TableMaterial.displayName = 'TableMaterial';

export default TableMaterial;
