"use client";
import React, {FormEvent, Fragment, useEffect, useRef, useState} from 'react';
import Input from "@/components/Inputs/Input";
import Select from "@/components/Inputs/Select";
import TextArea from "@/components/Inputs/TextArea";
import Alert from "@/components/Alert";
import Link from "next/link";
import {Provider} from "@/models/Model";
import {usePathname, useRouter} from "next/navigation";
import {getData} from "@/services/APIService";
import {District, DistrictResponse, Province, ProvinceResponse, Ward, WardResponse} from "@/models/ProvinceModel";
import {API_GET_ALL_DISTRICTS, API_GET_ALL_PROVINCES, API_GET_ALL_WARDS} from "@/config/api";
import SuccessModal from "@/components/Modal/SuccessModal";

interface Props {
    provider?: Provider;
}


const ProviderForm = ({provider}: Props) => {
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
    const [selectedStatus, setSelectedStatus] = useState<string>("ACTIVE");
    const [insertSuccess, setInsertSuccess] = useState<boolean>(false);

    useEffect(() => {
        if (provider) {
            setSelectedStatus(provider.status);
        }
    }, [provider]);

    useEffect(() => {
        const initialAddress = async () => {
            if (provider) {
                const provinceResult: ProvinceResponse = await getData(API_GET_ALL_PROVINCES);
                setProvinces(provinceResult.results);

                const province = provinceResult.results.find(province => province.province_name === provider.city);
                setSelectedProvince(province);

                const districtsResult: DistrictResponse = await getData(API_GET_ALL_DISTRICTS + '/' + province?.province_id);
                setDistricts(districtsResult.results);

                const district = districtsResult.results.find(district => district.district_name === provider.district);
                setSelectedDistrict(district);

                const wardsResult: WardResponse = await getData(API_GET_ALL_WARDS + '/' + district?.district_id);
                setWards(wardsResult.results);

                const ward = wardsResult.results.find(ward => ward.ward_name === provider.ward);
                setSelectedWard(ward);
            }
        }
        initialAddress();
    }, [provider]);


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
        const address: string = formData.get('address') as string;
        const email: string = formData.get('email') as string;

        if (name.trim() === '') {
            setError('Mã giảm giá là bắt buộc');
            return;
        }
        if (address.trim() === '') {
            setError('Địa chỉ là bắt buộc');
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

        console.log(JSON.stringify(Object.fromEntries(formData)));

        const method = (provider ? "PUT" : "POST");

        const response = await fetch(`http://localhost:8000/api/v1/providers${provider?.id ? "/" + provider.id : ''}`,
            {
                method: method,
                body: JSON.stringify(Object.fromEntries(formData)),
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
                        <Input label="Tên nhà cung cấp" feedback="Tên nhà cung cấp là bắt buộc"
                               placeholder="Nhập tên nhà cung cấp"
                               defaultValue={provider?.name}
                               type="text" name="name"/>

                        <div className="grid grid-cols-2 gap-3">
                            <Input label="Số điện thoại" feedback="Số điện thoại là bắt buộc"
                                   placeholder="Nhập số điện thoại"
                                   defaultValue={provider?.phone}
                                   type="text" name="phone"/>
                            <Input label="Email" feedback="Email là bắt buộc"
                                   placeholder="Nhập email nhà cung cấp"
                                   defaultValue={provider?.email}
                                   type="text" name="email"/>
                        </div>

                        <Input label="Địa chỉ" feedback="Địa chỉ là bắt buộc"
                               placeholder="Nhập địa chỉ cụ thể"
                               defaultValue={provider?.address}
                               type="text" name="address"/>

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

                        <Select label="Trạng thái" name="status" value={selectedStatus} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedStatus(e.target.value)}>
                            <option value="ACTIVE">Đang hoạt động</option>
                            <option value="TEMPORARILY_SUSPENDED">Tạm ngưng</option>
                        </Select>


                        <div>
                            <TextArea label="Ghi chú" placeholder="Nhập ghi chú" name="note" feedback=""
                                      defaultValue={provider?.note}/>
                        </div>
                    </div>
                </div>
                <div className="mt-5 flex justify-end gap-3">
                    <Link href={"/providers"} className="btn btn-danger text-sm inline-flex items-center gap-2">
                        <span className="hidden xl:block">Hủy</span>
                    </Link>

                    <button type="submit" className="btn btn-blue text-sm inline-flex items-center gap-2">
                        <span className="hidden xl:block">{provider ? "Cập nhật" : "Lưu"}</span>
                    </button>
                </div>
            </form>
        </Fragment>
    );
};

export default ProviderForm;