"use client"
import {Trash} from "@/components/Icons";
import React, {forwardRef, Fragment, useEffect, useState} from "react";
import Link from "next/link";
import {Employee} from "@/models/Model";
import {deleteData, getData} from "@/services/APIService";
import {API_DELETE_EMPLOYEE, API_GET_ALL_EMPLOYEES,} from "@/config/api";
import DeleteModal from "@/components/Modal/DeleteModal";
import DeleteSuccessModal from "@/components/Modal/DeleteSuccessModal";
import SelectDefault, {Option} from "@/components/Inputs/SelectDefault";
import DropdownInput from "@/components/Inputs/DropdownInput";


const roleOptions : Option[] = [
    {
        key: "",
        value: "Tất cả"
    },
    {
        key: "STOCKER",
        value: "Thủ kho"
    },
    {
        key: "ADMIN",
        value: "Quản lý"
    },
    {
        key: "SUPERADMIN",
        value: "Giám đốc"
    },
    {
        key: "SALES",
        value: "Nhân viên bán hàng"
    },
]

const filteredOptions : Option[] = [
    {
        key: "name",
        value: "Tên nhân viên"
    },
    {
        key: "phone",
        value: "Số điện thoại"
    },
    {
        key: "email",
        value: "Email"
    },
]

const TableEmployee = forwardRef((props, ref) => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [isOpenDeleteModal, setIsOpenDeleteModal] = useState<boolean>(false);
    const [isOpenSuccessModal, setIsOpenSuccessModal] = useState<boolean>(false);

    const [employeeToDeleted, setEmployeeToDeleted] = useState<Employee | null>(null);
    const [roleOptionSelected, setRoleOptionSelected] = useState<string>('');
    const [filteredOptionSelected, setFilteredOptionSelected] = useState<string>('name');
    const [searchValue, setSearchValue] = useState<string>("");


    const handleChangeRoleOption = (status: string) => {
        setRoleOptionSelected(status);
    }


    const handleChangeFilteredOption = (type: string) => {
        setFilteredOptionSelected(type);
    }

    const handleClickDeleteEmployee = (employee: Employee) => {
        setEmployeeToDeleted(employee);
        setIsOpenDeleteModal(true);
    }

    const handleDelete = async () => {
        await deleteData (API_DELETE_EMPLOYEE + '/' + employeeToDeleted?.id)
        setIsOpenDeleteModal(false);
        setIsOpenSuccessModal(true);
        getEmployees(API_GET_ALL_EMPLOYEES);
    }

    const handleCloseDeleteModal = () => {
        setIsOpenDeleteModal(false);
        setEmployeeToDeleted(null);
    }

    const getEmployees = async (endpoint: string) => {
        const newEmployees : Employee[] = await getData(endpoint);
        setEmployees(newEmployees);
    }

    const handleResetFilters = () => {
        setRoleOptionSelected('');
        setFilteredOptionSelected('');
        setSearchValue('');
        getEmployees(API_GET_ALL_EMPLOYEES);
    }

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (roleOptionSelected !== '') {
            params.append('role', roleOptionSelected);
        }
        if (filteredOptionSelected !== '' && searchValue !== '') {
            params.append(filteredOptionSelected, searchValue);
        }
        getEmployees(`${API_GET_ALL_EMPLOYEES}?${params.toString()}`);
    }

    useEffect(() => {
        getEmployees(API_GET_ALL_EMPLOYEES)
    }, []);

    const getRoleStyles = (roles: string) => {
        switch (roles) {
            case "STOCKER":
                return "bg-danger text-danger";
            case "ADMIN":
                return "bg-amber-500 text-amber-500";
            case "SUPERADMIN":
                return "bg-rose-500 text-rose-500";
            case "SALES":
                return "bg-primary text-primary";
        }
    };
    const getRoleText = (roles: string) => {
        switch (roles) {
            case "STOCKER":
                return "Thủ kho";
            case "ADMIN":
                return "Quản lý";
            case "SALES":
                return "Nhân viên bán hàng";
            case "SUPERADMIN":
                return "Giám đốc";
        }

    };

    const columns : string[] = ["ID", "Tên", "Sinh nhật", "Giới tính", "Email", "Phân quyền", "Trạng thái", ""];
    return (
        <Fragment>
            {
                isOpenSuccessModal && <DeleteSuccessModal title="Thành công" message="Xóa nhân viên thành công" onClose={() => setIsOpenSuccessModal(false)}/>
            }
            {
                isOpenDeleteModal && <DeleteModal title={`Xóa nhân viên`} message={`Bạn chắc chắn muốn xóa nhân viên ${employeeToDeleted?.id} - ${employeeToDeleted?.name}. Hành động này sẽ không thể hoàn tác`} onDelete={handleDelete} onClose={handleCloseDeleteModal}/>
            }
            <div
                className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                <div className="grid sm:grid-cols-12 gap-3 mb-5">

                    <div className="flex items-center"><label className="text-sm font-bold">Lọc</label></div>
                    <div className="xsm:col-span-10 sm:col-span-5 flex flex-row items-center justify-center">
                        <DropdownInput options={filteredOptions} selectedValue={filteredOptionSelected} onChangeDropdown={handleChangeFilteredOption} inputSearchValue={searchValue} onChangeInputSearch={(event: React.ChangeEvent<HTMLInputElement>) => setSearchValue(event.target.value)}/>
                    </div>

                    <div className="flex items-center"><label className="text-sm font-bold" htmlFor="searchStatus">Chức vụ</label></div>
                    <div className="xsm:col-span-10 sm:col-span-5 flex flex-row items-center justify-center">
                        <SelectDefault options={roleOptions} id="searchStatus" onChange={handleChangeRoleOption}
                                       selectedValue={roleOptionSelected}/>
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
                        {employees.map((employee: Employee, key: number) => (
                            <tr key={key} className="text-xs">
                                <td className="border-b border-[#eee] px-2 py-3 dark:border-strokedark border-x">
                                    <div className="flex justify-center">
                                        <input type="checkbox"/>
                                    </div>
                                </td>
                                <td className="border border-[#eee] px-2 py-3 dark:border-strokedark">
                                    <p className="text-black dark:text-white text-center">
                                        {employee.id}
                                    </p>
                                </td>
                                <td className="border border-[#eee] px-2 py-3 dark:border-strokedark">
                                    <h5 className="font-medium text-black dark:text-white">
                                        {`${employee.profile.first_name} ${employee.profile.last_name}`}
                                    </h5>
                                    <p className="text-xs">{employee.profile?.phone ? employee.profile.phone : "Không rõ"}</p>
                                </td>
                                <td className="border border-[#eee] px-2 py-3 dark:border-strokedark">
                                    <h5 className="font-medium text-black dark:text-white">
                                        {new Date(employee.profile?.birthday).toLocaleDateString()}
                                    </h5>
                                </td>
                                <td className="border border-[#eee] px-2 py-3 dark:border-strokedark">
                                    <h5 className="font-medium text-black dark:text-white">
                                        {employee.profile?.gender ? "Nam" : "Nữ"}
                                    </h5>
                                </td>

                                <td className="border border-[#eee] px-2 py-3 dark:border-strokedark">
                                    <p className="text-black dark:text-white">
                                        {employee.email}
                                    </p>
                                </td>
                                <td className="border border-[#eee] px-2 py-3 dark:border-strokedark border-l">
                                    <p
                                        className={`inline-flex rounded-full bg-opacity-10 px-3 py-1 font-medium text-xs ${getRoleStyles(employee.role?.name)}`}
                                    >
                                        {
                                            getRoleText(employee.role?.name)
                                        }
                                    </p>
                                </td>
                                <td className="border border-[#eee] px-2 py-3 dark:border-strokedark border-l">
                                    <p
                                        className={`inline-flex rounded-full bg-opacity-10 px-3 py-1 font-medium text-xs ${
                                            employee.role?.status === "ACTIVE"
                                                ? "bg-success text-success"
                                                : employee.role?.status === "DELETED"
                                                    ? "bg-danger text-danger"
                                                    : "bg-warning text-warning"
                                        }`}
                                    >
                                        {
                                            employee.role?.status === "ACTIVE" ? "Đang hoạt động" : "Không hoạt động"
                                        }
                                    </p>
                                </td>
                                <td className="border border-[#eee] px-2 py-3 dark:border-strokedark">
                                    <div className="flex items-center space-x-3.5 justify-center">
                                        <button className="hover:text-primary" type="button"
                                                onClick={() => handleClickDeleteEmployee(employee)}><Trash/></button>
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

TableEmployee.displayName = 'TableEmployee';

export default TableEmployee;
