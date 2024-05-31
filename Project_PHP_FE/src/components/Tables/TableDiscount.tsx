"use client"
import {Eye, Seach, Trash} from "@/components/Icons";
import React, {Fragment, useEffect, useState} from "react";
import Link from "next/link";
import {Discount} from "@/models/Model";
import {deleteData, getData} from "@/services/APIService";
import {API_DELETE_DISCOUNT, API_GET_ALL_DISCOUNTS} from "@/config/api";
import DeleteModal from "@/components/Modal/DeleteModal";
import SelectDefault, {Option} from "@/components/Inputs/SelectDefault";

const statusOptions : Option[] = [
    {
        key: "",
        value: "Tất cả trạng thái"
    },
    {
        key: "ACTIVE",
        value: "Đang hoạt động"
    },
    {
        key: "TEMPORARILY_SUSPENDED",
        value: "Tạm ngưng"
    },
]

const TableDiscount = () => {
    const [discounts, setDiscounts] = useState<Discount[]>([]);
    const [discount, setDiscount] = useState<Discount>();
    const [discountToDeleted, setDiscountToDeleted] = useState<Discount | null>(null);
    const [isOpenDeleteModal, setIsOpenDeleteModal] = useState<boolean>(false);
    const [isOpenSuccessModal, setIsOpenSuccessModal] = useState<boolean>(false);

    const [statusOptionSelected, setStatusOptionSelected] = useState<string>('');
    const [categoryOptionSelected, setCategoryOptionSelected] = useState<string>('');
    const [filteredOptionSelected, setFilteredOptionSelected] = useState<string>('name');

    const handleChangeStatusOption = (status: string) => {
        setStatusOptionSelected(status);
    }

    const handleClickDeleteDiscount = (discounts: Discount) => {
        setDiscountToDeleted(discounts);
        setIsOpenDeleteModal(true);
    }

    const handleDelete = async () => {
        await deleteData (API_DELETE_DISCOUNT + '/' + discountToDeleted?.id)
        setIsOpenDeleteModal(false);
        setIsOpenSuccessModal(true);
        getDiscounts(API_GET_ALL_DISCOUNTS);
    }

    const handleCloseDeleteModal = () => {
        setIsOpenDeleteModal(false);
        setDiscountToDeleted(null);
    }
    const handleResetFilters = () => {
        setCategoryOptionSelected('');
        setStatusOptionSelected('');
    }

    const handleSearch = () => {
        let params : string = '';
        if (statusOptionSelected !== '') {
            params += '?status=' + statusOptionSelected;
        }
        getDiscounts(API_GET_ALL_DISCOUNTS + params);
    }

    const getDiscounts = async (endpoint: string) => {
        const newDiscounts : Discount[] = await getData(endpoint);
        setDiscounts(newDiscounts);
    }

    useEffect(() => {
        getDiscounts(API_GET_ALL_DISCOUNTS);
    }, []);

    const columns: string[] = ["ID", "Mã giảm giá", "Giảm giá", "Đơn hàng tối thiểu", "Giảm giá tối đa", "Ngày bắt đầu", "Ngày kết thúc", "Trạng thái", "Ghi chú", ""];
    return (
        <Fragment>
            {
                isOpenDeleteModal && <DeleteModal title={`Xóa khuyến mãi`} message={`Bạn chắc chắn muốn xóa khuyến mãi ${discount?.coupon_code}. Hành động này sẽ không thể hoàn tác`} onDelete={handleDelete} onClose={() => setIsOpenDeleteModal(false)}/>
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
                        {discounts.map((discount: Discount, key: number) => (
                            <tr key={key} className="text-xs">
                                <td className="border-b border-[#eee] px-2 py-3 dark:border-strokedark border-x">
                                    <div className="flex justify-center">
                                        <input type="checkbox"/>
                                    </div>
                                </td>
                                <td className="border border-[#eee] px-2 py-3 dark:border-strokedark">
                                    <p className="text-black dark:text-white text-center">
                                        {discount.id}
                                    </p>
                                </td>
                                <td className="border border-[#eee] px-2 py-3 dark:border-strokedark">
                                    <h5 className="font-medium text-black dark:text-white">
                                        {discount.coupon_code}
                                    </h5>
                                </td>
                                <td className="border border-[#eee] px-2 py-3 dark:border-strokedark">
                                    <h5 className="font-medium text-black dark:text-white text-end">
                                        {
                                            discount.discount_unit === "%" ? `${discount.discount_value} %` : new Intl.NumberFormat('vi-VN', {
                                                style: 'currency',
                                                currency: 'VND'
                                            }).format(discount.discount_value)
                                        }
                                    </h5>
                                </td>
                                <td className="border border-[#eee] px-2 py-3 dark:border-strokedark">
                                    <h5 className="font-medium text-black dark:text-white text-end">
                                        {new Intl.NumberFormat('vi-VN', {
                                            style: 'currency',
                                            currency: 'VND'
                                        }).format(discount.minimum_order_value)}
                                    </h5>
                                </td>
                                <td className="border border-[#eee] px-2 py-3 dark:border-strokedark">
                                    <h5 className="font-medium text-black dark:text-white text-end">
                                        {new Intl.NumberFormat('vi-VN', {
                                            style: 'currency',
                                            currency: 'VND'
                                        }).format(discount.maximum_discount_value)}
                                    </h5>
                                </td>
                                <td className="border border-[#eee] px-2 py-3 dark:border-strokedark">
                                    <p className="text-black dark:text-white">
                                        {new Date(discount.valid_start).toLocaleDateString()}
                                    </p>
                                </td>
                                <td className="border border-[#eee] px-2 py-3 dark:border-strokedark">
                                    <p className="text-black dark:text-white">
                                        {new Date(discount.valid_until).toLocaleDateString()}
                                    </p>
                                </td>
                                <td className="border border-[#eee] px-2 py-3 dark:border-strokedark">
                                    <p
                                        className={`inline-flex rounded-full bg-opacity-10 px-3 py-1 text-xs font-medium ${
                                            discount.status === "ACTIVE"
                                                ? "bg-success text-success"
                                                : discount.status === "TEMPORARILY_SUSPENDED"
                                                    ? "bg-danger text-danger"
                                                    : "bg-warning text-warning"
                                        }`}
                                    >
                                        {
                                            discount.status === "ACTIVE" ? "Đang Hoạt động" : discount.status === "TEMPORARILY_SUSPENDED" ? "Tạm ngưng" : "Không hoạt động"
                                        }
                                    </p>
                                </td>
                                <td className="border border-[#eee] px-2 py-3 dark:border-strokedark">
                                    <p className="text-black dark:text-white">
                                        {discount.note}
                                    </p>
                                </td>
                                <td className="border border-[#eee] px-2 py-3 dark:border-strokedark">
                                    <div className="flex items-center space-x-3.5">
                                        <Link href={`/discounts/${discount.id}`}
                                              className="hover:text-primary"><Eye/></Link>
                                        <button className="hover:text-primary" type="button"
                                                onClick={() => handleClickDeleteDiscount(discount)}><Trash/></button>
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

export default TableDiscount;
