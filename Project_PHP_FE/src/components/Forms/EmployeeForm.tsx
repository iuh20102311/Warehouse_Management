"use client";
import React, {FormEvent, Fragment, useEffect, useRef, useState} from 'react';
import Input from "@/components/Inputs/Input";
import Select from "@/components/Inputs/Select";
import TextArea from "@/components/Inputs/TextArea";
import Alert from "@/components/Alert";
import Link from "next/link";
import {Employee, GroupCustomer} from "@/models/Model";
import {usePathname, useRouter} from "next/navigation";
import {getData} from "@/services/APIService";
import {District, DistrictResponse, Province, ProvinceResponse, Ward, WardResponse} from "@/models/ProvinceModel";
import {API_GET_ALL_DISTRICTS, API_GET_ALL_PROVINCES, API_GET_ALL_WARDS} from "@/config/api";
import SuccessModal from "@/components/Modal/SuccessModal";
import Radio from "@/components/Inputs/Radio";

interface Props {
    employee?: Employee;
}


const ProviderForm = ({employee}: Props) => {
    const router = useRouter();
    const pathname = usePathname();
    const inputProductImage = useRef<HTMLInputElement>(null);
    const [error, setError] = useState<string | null>(null);
    const [provinces, setProvinces] = useState<Province[]>([]);
    const [districts, setDistricts] = useState<District[]>([]);
    const [wards, setWards] = useState<Ward[]>([]);
    const [selectedProvince, setSelectedProvince] = useState<Province>();
    const [selectedDistrict, setSelectedDistrict] = useState<District>();
    const [selectedWard, setSelectedWard] = useState<Ward>();
    const [insertSuccess, setInsertSuccess] = useState<boolean>(false);

    useEffect(() => {
        const initialAddress = async () => {
            if (employee) {
                const provinceResult: ProvinceResponse = await getData(API_GET_ALL_PROVINCES);
                setProvinces(provinceResult.results);

                const province = provinceResult.results.find(province => province.province_name === employee.city);
                setSelectedProvince(province);

                const districtsResult: DistrictResponse = await getData(API_GET_ALL_DISTRICTS + '/' + province?.province_id);
                setDistricts(districtsResult.results);

                const district = districtsResult.results.find(district => district.district_name === employee.district);
                setSelectedDistrict(district);

                const wardsResult: WardResponse = await getData(API_GET_ALL_WARDS + '/' + district?.district_id);
                setWards(wardsResult.results);

                const ward = wardsResult.results.find(ward => ward.ward_name === employee.ward);
                setSelectedWard(ward);
            }
        }
        initialAddress();
    }, [employee]);


    const handleChangeProvince = async (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId = event.target.value;
        const selected = provinces.find(province => province.province_id === selectedId);
        setSelectedProvince(selected);

        if (selectedId) {
            try {
                const districtsResult : DistrictResponse = await getData(API_GET_ALL_DISTRICTS + '/' + selectedId);
                setDistricts(districtsResult.results);
                setWards([])
            } catch (err) {
                console.log(err);
            }
        } else {
            setDistricts([]);
            setWards([])
        }
    }

    const handleChangeDistrict = async (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId = event.target.value;
        const selected = districts.find(district => district.district_id === selectedId);
        setSelectedDistrict(selected);

        if (selectedId) {
            try {
                const wardsResult : WardResponse = await getData(API_GET_ALL_WARDS + '/' + selectedId);
                setWards(wardsResult.results);
            } catch (err) {
                console.log(err);
            }
        } else {
            setWards([])
        }
    }

    const handleChangeWard = async (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId = event.target.value;
        const selected = wards.find(ward => ward.ward_id === selectedId);
        setSelectedWard(selected);
    }

    const openInputImage = () => {
        inputProductImage.current?.click();
    }
    const onSubmitProviderForm = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const name: string = formData.get('name') as string;
        const phone: string = formData.get('phone') as string;
        const email: string = formData.get('email') as string;

        if (name.trim() === '') {
            setError('Mã giảm giá là bắt buộc');
            return;
        }
        if (phone.trim() === '') {
            setError('Số điện thoại là bắt buộc');
            return;
        }
        if (email.trim() === '') {
            setError('Email là bắt buộc');
            return;
        }
        if (selectedProvince) {
            formData.set('city', selectedProvince.province_name);
        }
        if (selectedDistrict) {
            formData.set('district', selectedDistrict.district_name);
        }
        if (selectedWard) {
            formData.set('ward', selectedWard.ward_name);
        }
        const data : Record<string, any> = Object.fromEntries(formData);
        if (data.gender === "1") {
            data.gender = 1;
        } else {
            data.gender = 0;
        }
        console.log(JSON.stringify(data));

        const method = (employee ? "PUT" : "POST");

        const response = await fetch(`http://localhost:8000/api/v1/users${employee?.id ? "/" + employee.id : ''}`,
            {
                method: method,
                body: JSON.stringify(data),
                headers: {
                    'content-type': 'application/json'
                },
            }
        );


        if (response.ok) {
            setInsertSuccess(true);
        } else {
            console.log("that bai");
        }

    }

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                setError(null);
            }, 4000);

            return () => clearTimeout(timer);
        }
    }, [error]);

    useEffect(() => {
        const getAllProvinces = async () => {
            const provinceResult: ProvinceResponse = await getData(API_GET_ALL_PROVINCES);
            setProvinces(provinceResult.results);
        }

        getAllProvinces();
    }, []);
    return (
        <Fragment>
            {
                insertSuccess && (
                    pathname.toString().includes('new') ?
                        <SuccessModal title="Thành công" message="Thêm nhà cung cấp thành công" onClickLeft={() => {router.back()}} onClickRight={() => {}}/> :
                        <SuccessModal title="Thành công" message="Cập nhật nhà cung cấp thành công" onClickLeft={() => {router.back()}} onClickRight={() => {}}/>
                )
            }
            <form onSubmit={onSubmitProviderForm}>
                {
                    error && <Alert message={error} type="error"/>
                }
                <div
                    className="rounded-sm border border-stroke bg-white px-5 pb-2.5 py-2 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                    <div className="border-b border-opacity-30">
                        <span className="text-sm text-black-2 font-bold mb-3 block">Thông tin chung</span>
                    </div>

                    <div className="py-2">
                        <Input label="Tên nhân viên" feedback="Tên nhân viên là bắt buộc"
                               placeholder="Nhập tên nhân viên"
                               defaultValue={employee?.name}
                               type="text" name="name"/>

                        <div className="grid grid-cols-2 gap-3">
                            <Input label="Số điện thoại" feedback="Số điện thoại là bắt buộc"
                                   placeholder="Nhập số điện thoại"
                                   defaultValue={employee?.phone}
                                   type="text" name="phone"/>
                            <Input label="Email" feedback="Email là bắt buộc"
                                   placeholder="Nhập email"
                                   defaultValue={employee?.email}
                                   type="text" name="email"/>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <Input label="Sinh nhật" feedback="Sinh nhật"
                                   placeholder="Nhập sinh nhật"
                                   type="date" name="birthday"
                                   defaultValue={employee?.birthday && new Date(employee.birthday).toISOString().split('T')[0]}/>
                            <Select label="Phân quyền" name="roles" defaultValue="STOCKER">
                                <option value="STOCKER">Thủ kho</option>
                                <option value="SALES">Nhân viên bán hàng</option>
                                <option value="SUPERADMIN">Giám đốc</option>
                                <option value="ADMIN">Quản lý</option>
                            </Select>

                        </div>
                        <div>
                            <div className="tracking-wide text-gray-700 text-sm font-bold mb-2">Giới tính</div>
                            <Radio label="Nam" name="gender" value={1}
                                   defaultChecked={employee ? Boolean(employee?.gender) : true}/>
                            <Radio label="Nữ" name="gender" value={0}
                                   defaultChecked={employee ? !Boolean(employee?.gender) : false}/>
                        </div>

                        <div>
                            <TextArea label="Ghi chú" placeholder="Nhập ghi chú" name="note" feedback=""
                                      defaultValue={employee?.note}/>
                        </div>
                    </div>
                </div>
                <div className="mt-5 flex justify-end gap-3">
                    <Link href={"/providers"} className="btn btn-danger text-sm inline-flex items-center gap-2">
                        <span className="hidden xl:block">Hủy</span>
                    </Link>

                    <button type="submit" className="btn btn-blue text-sm inline-flex items-center gap-2">
                        <span className="hidden xl:block">{employee ? "Cập nhật" : "Lưu"}</span>
                    </button>
                </div>
            </form>
        </Fragment>
    );
};

export default ProviderForm;