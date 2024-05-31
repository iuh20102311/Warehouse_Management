"use client"
import {Eye, Trash} from "@/components/Icons";
import React, {Fragment, useEffect, useState} from "react";
import Link from "next/link";
import {Order} from "@/models/Model";
import DeleteModal from "@/components/Modal/DeleteModal";
import {deleteData, getData} from "@/services/APIService";
import {API_DELETE_ORDER, API_GET_ALL_ORDERS} from "@/config/api";
import DeleteSuccessModal from "@/components/Modal/DeleteSuccessModal";
import SelectDefault, {Option} from "@/components/Inputs/SelectDefault";
import InputDefault from "@/components/Inputs/InputDefault";

const statusOptions: Option[] = [
    {
        key: "",
        value: "Tất cả trạng thái"
    },
    {
        key: "PROCESSING",
        value: "Đang xử lý"
    },
    {
        key: "PENDING_PAYMENT",
        value: "Chờ thanh toán"
    },
    {
        key: "PAID",
        value: "Đã thanh toán"
    },
    {
        key: "SHIPPING",
        value: "Đang giao hàng"
    },
    {
        key: "COMPLETE",
        value: "Hoàn thành"
    },
    {
        key: "CANCEL",
        value: "Hoàn thành"
    },
]

const TableOrder = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [orderToDeleted, setOrderToDeleted] = useState<Order | null>(null);
    const [isOpenDeleteModal, setIsOpenDeleteModal] = useState<boolean>(false);
    const [isOpenSuccessModal, setIsOpenSuccessModal] = useState<boolean>(false);

    // Stored query params
    const [statusOptionSelected, setStatusOptionSelected] = useState<string>('');
    const [phoneToSearch, setPhoneToSearch] = useState<string>("");

    const handleChangeStatusOption = (status: string) => {
        setStatusOptionSelected(status);
    }

    const handleChangePhoneToSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = event.target.value;
        setPhoneToSearch(inputValue.replace(/\D/g, ''));
    }

    const handleClickDeleteOrder = (orders: Order) => {
        setOrderToDeleted(orders);
        setIsOpenDeleteModal(true);
    }

    const handleDelete = async () => {
        await deleteData(API_DELETE_ORDER + '/' + orderToDeleted?.id)
        setIsOpenDeleteModal(false);
        setIsOpenSuccessModal(true);
        getOrders(API_GET_ALL_ORDERS);
    }

    const handleCloseDeleteModal = () => {
        setIsOpenDeleteModal(false);
        setOrderToDeleted(null);
    }
    const handleResetFilters = () => {
        setStatusOptionSelected('');
        setPhoneToSearch('');
        getOrders(API_GET_ALL_ORDERS);
    }

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (statusOptionSelected !== '') {
            params.append('status', statusOptionSelected);
        }
        if (phoneToSearch !== "") {
            params.append('phone', phoneToSearch);
        }
        const queryString = params.toString();
        const url = queryString ? `${API_GET_ALL_ORDERS}?${queryString}` : API_GET_ALL_ORDERS;
        getOrders(url);
    }

    const getOrders = async (endpoint: string) => {
        const newOrders: Order[] = await getData(endpoint);
        setOrders(newOrders);
    }

    const getStatusStyles = (status: string) => {
        switch (status) {
            case "PROCESSING":
                return "bg-indigo-600 text-indigo-600";
            case "PENDING_PAYMENT":
                return "bg-amber-500 text-amber-500";
            case "PAID":
                return "bg-rose-500 text-rose-500";
            case "SHIPPING":
                return "bg-primary text-primary";
            case "COMPLETE":
                return "bg-success text-success";
            default:
                return "bg-danger text-danger";
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case "PROCESSING":
                return "Đang xử lý";
            case "PENDING_PAYMENT":
                return "Chờ thanh toán";
            case "PAID":
                return "Đã thanh toán";
            case "SHIPPING":
                return "Đang giao hàng";
            case "COMPLETE":
                return "Hoàn thành";
            case "CANCLE":
                return "Hủy";
        }

    };

    useEffect(() => {
        getOrders(API_GET_ALL_ORDERS);
    }, []);

    const columns: string[] = ["ID", "Khách hàng", "Số điện thoại", "Tổng tiền", "Địa chỉ", "Trạng thái", "Người tạo", "Ngày tạo", ""];
    return (
        <Fragment>
            {
                isOpenSuccessModal && <DeleteSuccessModal title="Thành công" message="Xóa đơn hàng thành công"
                                                          onClose={() => setIsOpenSuccessModal(false)}/>
            }
            {
                isOpenDeleteModal && <DeleteModal title={`Xóa đơn hàng`}
                                                  message={`Bạn chắc chắn muốn xóa đơn hàng ${orderToDeleted?.id} - ${orderToDeleted?.customer.name}. Hành động này sẽ không thể hoàn tác`}
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

                    <div className="flex items-center"><label className="text-sm font-bold" htmlFor="searchStatus">Số
                        điện thoại</label></div>
                    <div className="xsm:col-span-10 sm:col-span-5 flex flex-row items-center justify-center">
                        <InputDefault placeholder="Nhập số điện thoại" type="tel" name="phone" value={phoneToSearch}
                                      onChange={handleChangePhoneToSearch}/>
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
                    <table className="w-full min-w-[950px] table-auto">
                        <thead>
                        <tr className="bg-gray-3 text-left text-xs dark:bg-meta-4">
                            <td className="border-b border-[#eee] px-2 py-3 dark:border-strokedark border-x">
                                <div className="flex justify-center">
                                    <input type="checkbox"/>
                                </div>
                            </td>
                            {
                                columns.map((column: string, index: number) => (
                                    <th key={"columns-" + index}
                                        className="border border-[#eee] min-w-[50px] px-2 py-2 font-bold text-black dark:text-white text-center">
                                        {column}
                                    </th>
                                ))
                            }
                        </tr>
                        </thead>
                        <tbody className="text-left">
                        {orders.map((order: Order, key: number) => (
                            <tr key={key} className="text-xs hover:bg-gray odd:bg-white even:bg-slate-50">
                                <td className="border-b border-[#eee] px-2 py-3 dark:border-strokedark border-x ">
                                    <div className="flex justify-center">
                                        <input type="checkbox"/>
                                    </div>
                                </td>
                                <td className="border border-[#eee] px-2 py-3 dark:border-strokedark text-center">
                                    <Link href={`orders/${order.id}`}>
                                        {order.id}
                                    </Link>
                                </td>
                                <td className="border border-[#eee] px-2 py-3 dark:border-strokedark">
                                    <h5 className="font-medium text-black dark:text-white">
                                        {order.customer.name}
                                    </h5>
                                </td>
                                <td className="border border-[#eee] px-2 py-3 dark:border-strokedark">
                                    <h5 className="font-medium text-black dark:text-white">
                                        {order.phone}
                                    </h5>
                                </td>
                                <td className="border border-[#eee] px-2 py-3 dark:border-strokedark">
                                    <h5 className="font-medium text-black dark:text-white text-end">
                                        {new Intl.NumberFormat('vi-VN', {
                                            style: 'currency',
                                            currency: 'VND'
                                        }).format(order.total_price)}
                                    </h5>
                                </td>
                                <td className="border border-[#eee] px-2 py-3 dark:border-strokedark">
                                    <h5 className="font-medium text-black dark:text-white">
                                        {order.address}, {order.ward}, {order.district}, {order.city}
                                    </h5>
                                </td>

                                <td className="border border-[#eee] px-2 py-3 dark:border-strokedark border-l">
                                    <p
                                        className={`inline-flex rounded-full bg-opacity-10 px-3 py-1 font-medium text-xs ${getStatusStyles(order.status)}`}
                                    >
                                        {
                                            getStatusText(order.status)
                                        }
                                    </p>
                                </td>
                                <td className="border border-[#eee] px-2 py-3 dark:border-strokedark">
                                    <h5 className="font-medium text-black dark:text-white">
                                        {`${order.profile.first_name} ${order.profile.last_name}`}
                                    </h5>
                                </td>
                                <td className="border border-[#eee] px-2 py-3 dark:border-strokedark">
                                    <p className="text-black dark:text-white">
                                        {new Date(order.created_at).toLocaleString()}
                                    </p>
                                </td>
                                <td className="border border-[#eee] px-2 py-3 dark:border-strokedark">
                                    <div className="flex items-center justify-center space-x-3.5">
                                        <Link href={`/orders/${order.id}`} className="hover:text-primary"><Eye/></Link>
                                        <button className="hover:text-primary" type="button"
                                                onClick={() => handleClickDeleteOrder(order)}><Trash/></button>
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
                            className=" rounded bg-gray-50 text-xs py-2 px-2 font-bold focus:outline-none border border-gray-500 text-gray-600"
                            defaultValue={10}>
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
};

export default TableOrder;
