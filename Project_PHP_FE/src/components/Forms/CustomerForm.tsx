"use client";
import React, {FormEvent, Fragment, useEffect, useState} from 'react';
import Input from "@/components/Inputs/Input";
import Select from "@/components/Inputs/Select";
import TextArea from "@/components/Inputs/TextArea";
import Radio from "@/components/Inputs/Radio";
import Alert from "@/components/Alert";
import Link from "next/link";
import {CustomerDetail, GroupCustomer} from "@/models/Model";
import {useRouter} from "next/navigation";
import {District, DistrictResponse, Province, ProvinceResponse, Ward, WardResponse} from "@/models/ProvinceModel";
import {getData} from "@/services/APIService";
import {API_GET_ALL_DISTRICTS, API_GET_ALL_PROVINCES, API_GET_ALL_WARDS} from "@/config/api";
import SuccessModal from "@/components/Modal/SuccessModal";

interface Props {
    customer?: CustomerDetail;
}

const CustomerForm = ({customer}: Props) => {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [groups, setGroups] = useState<GroupCustomer[]>();
    const [provinces, setProvinces] = useState<Province[]>([]);
    const [districts, setDistricts] = useState<District[]>([]);
    const [wards, setWards] = useState<Ward[]>([]);
    const [selectedProvince, setSelectedProvince] = useState<Province>();
    const [selectedDistrict, setSelectedDistrict] = useState<District>();
    const [selectedWard, setSelectedWard] = useState<Ward>();
    const [insertSuccess, setInsertSuccess] = useState<boolean>(false);
    const [selectedGroup, setSelectedGroup] = useState<number>(1);
    const [selectedGender, setSelectedGender] = useState<boolean>(true);

    useEffect(() => {
        const initialAddress = async () => {
            if (customer) {
                const provinceResult: ProvinceResponse = await getData(API_GET_ALL_PROVINCES);
                setProvinces(provinceResult.results);

                const province = provinceResult.results.find(province => province.province_name === customer.city);
                setSelectedProvince(province);

                const districtsResult: DistrictResponse = await getData(API_GET_ALL_DISTRICTS + '/' + province?.province_id);
                setDistricts(districtsResult.results);

                const district = districtsResult.results.find(district => district.district_name === customer.district);
                setSelectedDistrict(district);

                const wardsResult: WardResponse = await getData(API_GET_ALL_WARDS + '/' + district?.district_id);
                setWards(wardsResult.results);

                const ward = wardsResult.results.find(ward => ward.ward_name === customer.ward);
                setSelectedWard(ward);

                setSelectedGroup(customer.group_customer.id);
                setSelectedGender(customer.gender)
            }
        }
        initialAddress();
    }, [customer]);


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
    const getAllGroupCustomers = async () => {
        await fetch(`http://localhost:8000/api/v1/group_customers`)
            .then(res => {
                return res.json()
            })
            .then(data => {
                setGroups(data);
            })
            .catch(err => {
                console.log(err);
            })
    }
    const onSubmitCustomerForm = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const name: string = formData.get('name') as string;
        const email: string = formData.get('email') as string;
        const phone: string = formData.get('phone') as string;
        const address: string = formData.get('address') as string;

        if (name.trim() === '') {
            setError('Tên khách hàng là bắt buộc');
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
        if (address.trim() === '') {
            setError('Địa chỉ là bắt buộc');
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
        data.status = "ACTIVE";
        data.group_customer_id = Number(data.group_customer_id);

        const method = (customer ? "PUT" : "POST");

        const response = await fetch(`http://localhost:8000/api/v1/customers${customer ? "/" + customer.id : ''} `,
            {
                method: method,
                body: JSON.stringify(data),
                headers: {
                    'content-type': 'application/json'
                }
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
        getAllGroupCustomers();
    }, []);

    useEffect(() => {
        const getAllProvinces = async () => {
            const result: ProvinceResponse = await getData(API_GET_ALL_PROVINCES);
            setProvinces(result.results);
        }

        getAllProvinces();
    }, []);

    return (
        <Fragment>
            {
                insertSuccess && <SuccessModal title="Thành công" message="Thêm khách hàng thành công" onClickLeft={() => {router.back()}} onClickRight={() => {}}/>
            }
            <form onSubmit={onSubmitCustomerForm}>
                {
                    error && <Alert message={error} type="error"/>
                }
                <div
                    className="rounded-sm border border-stroke bg-white px-5 pb-2.5 py-2 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                    <div className="border-b border-opacity-30">
                        <span className="text-sm text-black-2 font-bold mb-3 block">Thông tin chung</span>
                    </div>

                    <div className="py-2">
                        <Input label="Tên khách hàng" feedback="Tên khách hàng là bắt buộc"
                               placeholder="Nhập tên khách hàng"
                               defaultValue={customer?.name}
                               type="text" name="name"/>

                        <Input label="Sinh nhật" feedback="Sinh nhật"
                               placeholder="Nhập sinh nhật"
                               type="date" name="birthday"
                               defaultValue={customer?.birthday && new Date(customer.birthday).toISOString().split('T')[0]}/>

                        <Input label="Email" feedback="Email là bắt buộc"
                               placeholder="Nhập email"
                               defaultValue={customer?.email}
                               type="email"
                               name="email"/>

                        <div className="grid grid-cols-2 gap-3">
                            <Input label="Số điện thoại" feedback="Số điện thoại là bắt buộc"
                                   placeholder="Nhập Số điện thoại"
                                   defaultValue={customer?.phone}
                                   type="text"
                                   name="phone"/>

                            <Select label="Nhóm khách hàng" name="group_customer_id"
                                    value={selectedGroup} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedGroup(Number(e.target.value))}>
                                {
                                    groups?.map((group: GroupCustomer) => (
                                        <option key={group.id} value={group.id}>{group.name}</option>
                                    ))
                                }
                            </Select>
                        </div>
                        <Input label="Địa chỉ" feedback="Địa chỉ là bắt buộc"
                               placeholder="Nhập địa chỉ cụ thể"
                               type="text"
                               defaultValue={customer?.address}
                               name="address"/>

                        <div className="grid grid-cols-3 gap-3">
                            <Select label="Thành phố/Tỉnh" name="city" value={selectedProvince?.province_id || ''} onChange={handleChangeProvince}>
                                <option value="">Chọn thành phố/tỉnh</option>
                                {
                                    provinces.map((province: Province) => (
                                        <option key={province.province_id}
                                                value={province.province_id}>{province.province_name}</option>
                                    ))
                                }
                            </Select>

                            <Select label="Quận/Huyện" name="district" value={selectedDistrict?.district_id || ''} onChange={handleChangeDistrict}>
                                <option value="">Chọn quận/huyện</option>
                                {
                                    districts.map((district: District) => (
                                        <option key={district.district_id}
                                                value={district.district_id}>{district.district_name}</option>
                                    ))
                                }
                            </Select>

                            <Select label="Phường/xã" name="ward" value={selectedWard?.ward_id || ''} onChange={handleChangeWard}>
                                <option value="">Chọn xã/phường</option>
                                {
                                    wards.map((ward: Ward) => (
                                        <option key={ward.ward_id} value={ward.ward_id}>{ward.ward_name}</option>
                                    ))
                                }
                            </Select>
                        </div>
                        <div>
                            <div className="tracking-wide text-gray-700 text-sm font-bold mb-2">Giới tính</div>
                            <Radio label="Nam" name="gender" value={1}
                                   defaultChecked={customer ? Boolean(customer?.gender) : true}/>
                            <Radio label="Nữ" name="gender" value={0}
                                   defaultChecked={customer ? !Boolean(customer?.gender) : false}/>
                        </div>

                        <div>
                            <TextArea label="Ghi chú" placeholder="Nhập ghi chú" name="note" feedback=""
                                      defaultValue={customer?.note}/>
                        </div>
                    </div>
                </div>
                <div className="mt-5 flex justify-end gap-3">
                    <Link href={"/customers"} className="btn btn-danger text-sm inline-flex items-center gap-2">
                        <span className="hidden xl:block">Hủy</span>
                    </Link>

                    <button type="submit" className="btn btn-blue text-sm inline-flex items-center gap-2">
                        <span className="hidden xl:block">{customer ? "Cập nhật" : "Lưu"}</span>
                    </button>
                </div>
            </form>
        </Fragment>
    );
};

export default CustomerForm;