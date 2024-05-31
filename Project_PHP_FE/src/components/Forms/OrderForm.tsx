"use client";
import React, {FormEvent, Fragment, useEffect, useRef, useState} from 'react';
import Input from "@/components/Inputs/Input";
import Select from "@/components/Inputs/Select";
import TextArea from "@/components/Inputs/TextArea";
import Radio from "@/components/Inputs/Radio";
import Alert from "@/components/Alert";
import {usePathname, useRouter} from "next/navigation";
import Link from "next/link";
import {Order} from "@/models/Model";
import InputDefault from "@/components/Inputs/InputDefault";
import {CircleHelp, CreditCard, Trash, Truck} from "@/components/Icons";
import Image from "next/image";
import {District, DistrictResponse, Province, ProvinceResponse, Ward, WardResponse} from "@/models/ProvinceModel";
import {getData} from "@/services/APIService";
import {API_GET_ALL_DISTRICTS, API_GET_ALL_PROVINCES, API_GET_ALL_WARDS} from "@/config/api";
import SuccessModal from "@/components/Modal/SuccessModal";
import Tooltip from "@/components/comon/Tooltip";
import SearchProductModal from "@/components/Modal/SearchProductModal";
import {ProductCart} from "@/models/Product";
import CircleDollarSign from "../Icons/CircleDollarSign";
import HandHelping from "../Icons/HandHelping";

interface Props {
    order?: Order;
}

const columns: string[] = ["Sản phẩm", "Quy cách đóng gói", "Số lượng đặt", "Tồn kho", "Đơn giá", "Thành tiền (đ)", ""];
const OrderForm = ({order}: Props) => {
    const router = useRouter();
    const pathname = usePathname();
    const inputProductImage = useRef<HTMLInputElement>(null);
    const [products, setProducts] = useState<ProductCart[]>([]);
    const [totalPrice, setTotalPrice] = useState<number>(0);
    const [provinces, setProvinces] = useState<Province[]>([]);
    const [districts, setDistricts] = useState<District[]>([]);
    const [wards, setWards] = useState<Ward[]>([]);
    const [selectedProvince, setSelectedProvince] = useState<Province>();
    const [selectedDistrict, setSelectedDistrict] = useState<District>();
    const [selectedWard, setSelectedWard] = useState<Ward>();

    const [showSearchProductModal, setShowSearchProductModal] = useState<boolean>(false);

    useEffect(() => {
        const initialAddress = async () => {
            if (order) {
                const provinceResult: ProvinceResponse = await getData(API_GET_ALL_PROVINCES);
                setProvinces(provinceResult.results);

                const province = provinceResult.results.find(province => province.province_name === order.city);
                setSelectedProvince(province);

                const districtsResult: DistrictResponse = await getData(API_GET_ALL_DISTRICTS + '/' + province?.province_id);
                setDistricts(districtsResult.results);

                const district = districtsResult.results.find(district => district.district_name === order.district);
                setSelectedDistrict(district);

                const wardsResult: WardResponse = await getData(API_GET_ALL_WARDS + '/' + district?.district_id);
                setWards(wardsResult.results);

                const ward = wardsResult.results.find(ward => ward.ward_name === order.ward);
                setSelectedWard(ward);
            }
        }
        initialAddress();
    }, [order]);

    const handleChangeProvince = async (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId = event.target.value;
        const selected = provinces.find(province => province.province_id === selectedId);
        setSelectedProvince(selected);

        if (selectedId) {
            try {
                const districtsResult: DistrictResponse = await getData(API_GET_ALL_DISTRICTS + '/' + selectedId);
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
                const wardsResult: WardResponse = await getData(API_GET_ALL_WARDS + '/' + selectedId);
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

    const handleChangeSearchInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!showSearchProductModal) {
            setShowSearchProductModal(true);
        }
    }
    const openInputImage = () => {
        inputProductImage.current?.click();
    }
    const [error, setError] = useState<string | null>(null);
    const [insertSuccess, setInsertSuccess] = useState<boolean>(false);

    const onSubmitOrderForm = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const name: string = formData.get('name') as string;
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

        const method = (order ? "PUT" : "POST");
        const response = await fetch('http://localhost:8000/api/v1/orders',
            {
                method: "POST",
                body: JSON.stringify(Object.fromEntries(formData)),
                headers: {
                    'content-type': 'application/json'
                }
            }
        );

        if (response.ok) {
            router.push('/orders');
        } else {
            console.log("that bai");
        }
    }

    const handleChangeQuantity = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const updatedProducts = [...products];
        updatedProducts[index].quantityInCart = Number(e.target.value);
        setProducts(updatedProducts);
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
            const result: ProvinceResponse = await getData(API_GET_ALL_PROVINCES);
            setProvinces(result.results);
        }

        getAllProvinces();
    }, []);

    useEffect(() => {
        if (products) {
            let newTotalPrice = 0;
            products.forEach(product => {
                newTotalPrice += product.price * product.quantityInCart;
            });
            setTotalPrice(newTotalPrice);
        }
    }, [products]);
    const handleCloseModal = () => {
        setShowSearchProductModal(false);
    }

    const handleRemoveProductFromCart = (index: number) => {
        const updatedProducts = [...products];
        updatedProducts.splice(index, 1);
        setProducts(updatedProducts);
    }

    return (
        <Fragment>
            {
                showSearchProductModal &&
                <SearchProductModal onClose={handleCloseModal} products={products} setProducts={setProducts}/>
            }
            {
                insertSuccess && (
                    pathname.toString().includes('new') ?
                        <SuccessModal title="Thành công" message="Thêm đơn hàng thành công" onClickLeft={() => {
                            router.back()
                        }} onClickRight={() => {
                        }}/> :
                        <SuccessModal title="Thành công" message="Cập nhật đơn hàng thành công" onClickLeft={() => {
                            router.back()
                        }} onClickRight={() => {
                        }}/>
                )
            }
            <form onSubmit={onSubmitOrderForm} className="flex flex-col gap-5">
                {
                    error && <Alert message={error} type="error"/>
                }
                <div
                    className="rounded-sm border border-stroke bg-white px-5 pb-2.5 py-2 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                    <div className="border-b border-opacity-30">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm text-black-2 font-bold block">Thông tin khách hàng</span>
                            <Tooltip message="Thông tin khách hàng dùng để giao hàng">
                                <CircleHelp stroke="#27c1f0"/>
                            </Tooltip>
                        </div>
                    </div>
                    <div className="py-2">
                        <Select label="Tên khách hàng" name="name" defaultValue="Nguyễn Thị A">
                            <option value="Nguyễn Thị A" selected={true}>Nguyễn Thị A</option>
                            <option value="Trần Thị Thu">Trần Thị Thu</option>
                            <option value="Nguyễn Hoàng Ân">Nguyễn Hoàng Ân</option>
                        </Select>

                        <div className="grid grid-cols-2 gap-3">
                            <Input label="Địa chỉ" feedback="Địa chỉ là bắt buộc"
                                   placeholder="Nhập địa chỉ cụ thể"
                                   type="text"
                                   defaultValue={order?.address}
                                   name="address"/>

                            <Input label="Số điện thoại" feedback="Số điện thoại là bắt buộc"
                                   placeholder="Nhập Số điện thoại"
                                   defaultValue={order?.phone}
                                   type="text"
                                   name="phone"/>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                            <Select label="Thành phố/Tỉnh" name="city" value={selectedProvince?.province_id || ''}
                                    onChange={handleChangeProvince}>
                                <option value="">Chọn thành phố/tỉnh</option>
                                {
                                    provinces.map((province: Province) => (
                                        <option key={province.province_id}
                                                value={province.province_id}>{province.province_name}</option>
                                    ))
                                }
                            </Select>

                            <Select label="Quận/Huyện" name="district" value={selectedDistrict?.district_id || ''}
                                    onChange={handleChangeDistrict}>
                                <option value="">Chọn quận/huyện</option>
                                {
                                    districts.map((district: District) => (
                                        <option key={district.district_id}
                                                value={district.district_id}>{district.district_name}</option>
                                    ))
                                }
                            </Select>

                            <Select label="Phường/xã" name="ward" value={selectedWard?.ward_id || ''}
                                    onChange={handleChangeWard}>
                                <option value="">Chọn xã/phường</option>
                                {
                                    wards.map((ward: Ward) => (
                                        <option key={ward.ward_id} value={ward.ward_id}>{ward.ward_name}</option>
                                    ))
                                }
                            </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <Select label="Khuyến mãi" name="discount" defaultValue="true">
                                <option value="IN_STOCK" selected={true}>Đang bán</option>
                                <option value="TEMPORARILY_SUSPENDED">Tạm ngưng</option>
                                <option value="OUT_OF_STOCK">Hết hàng</option>
                            </Select>

                            <Select label="Trạng thái" name="status" defaultValue="PROCESSING">
                                <option value="PROCESSING" selected={true}>Đang xử lý</option>
                                <option value="PENDING_PAYMENT">Chờ thanh toán</option>
                                <option value="PAID">Đã thanh toán</option>
                                <option value="SHIPPING">Đang giao hàng</option>
                                <option value="COMPLETE">Hoàn thành</option>
                                <option value="CANCEL">Hủy</option>
                            </Select>

                        </div>
                    </div>
                </div>


                <div
                    className="rounded-sm border border-stroke bg-white px-5 pb-2.5 py-2 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                    <div className="border-b border-opacity-30">
                        <span className="text-sm text-black-2 font-bold mb-3 block">Sản phẩm</span>
                    </div>
                    <div className="flex flex-col gap-2 py-3">
                        <div className="flex flex-row justify-between gap-3 items-center">
                            <InputDefault placeholder="Nhập tên sản phẩm" type="text" name="" value=""
                                          onChange={handleChangeSearchInput}/>
                            <button className="appearance-none rounded px-10 py-1 btn-blue" type="button"
                                    onClick={() => setShowSearchProductModal(true)}>Tìm
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full table-auto min-h-50 min-w-[950px]">
                                <thead>
                                <tr className="bg-gray-2 text-left text-xs dark:bg-meta-4">
                                    {
                                        columns.map((column: string, index: number) => (
                                            <th key={"columns-" + index}
                                                className="min-w-[50px] px-2 py-2 font-medium text-black dark:text-white border border-[#eee] text-center">
                                                {column}
                                            </th>
                                        ))
                                    }
                                </tr>
                                </thead>
                                <tbody className="text-left">
                                {products.map((product: ProductCart, index: number) => (
                                    <tr key={index} className="text-xs border-b border-[#eee]">
                                        <td className="px-2 py-3 dark:border-strokedark border-[#eee] border">
                                            <div className="flex flex-row gap-2 ">
                                                <div>
                                                    <Image src={"/images/default/no-image.png"} alt="" width={50}
                                                           height={50}
                                                           className="rounded border border-opacity-30 aspect-square object-cover border-[#eee]"/>
                                                </div>
                                                <div>
                                                    <a href={`/products/${product.id}`} target="_blank"
                                                       className="font-bold text-sm text-blue-600 block mb-1">{product.name}</a>
                                                    <div>SKU: {product.sku}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-2 py-3 dark:border-strokedark border border-[#eee] text-center">
                                            {product.packing}
                                        </td>
                                        <td className="px-2 py-3 dark:border-strokedark border border-[#eee] text-center">
                                            <input defaultValue={product.quantityInCart} min={1} max={product.quantity}
                                                   onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleChangeQuantity(index, event)}
                                                   type="number"
                                                   className="border border-t-body rounded focus:outline-blue-500 py-1 px-3 text-sm  w-full"/>
                                        </td>
                                        <td className="px-2 py-3 dark:border-strokedark border border-[#eee] text-center">
                                            {product.quantity}
                                        </td>

                                        <td className="px-2 py-3 dark:border-strokedark border border-[#eee] text-end">
                                            <h5 className="font-medium text-black dark:text-white">
                                                {new Intl.NumberFormat('vi-VN', {
                                                    style: 'currency',
                                                    currency: 'VND'
                                                }).format(product.price)}
                                            </h5>
                                        </td>
                                        <td className="px-2 py-3 dark:border-strokedark border border-[#eee] text-end">
                                            <h5 className="font-medium text-black dark:text-white">
                                                {new Intl.NumberFormat('vi-VN', {
                                                    style: 'currency',
                                                    currency: 'VND'
                                                }).format(product.price * product.quantityInCart)}
                                            </h5>
                                        </td>

                                        <td className="px-2 py-3 dark:border-strokedark border border-[#eee] text-center">
                                            <div className="flex items-center space-x-3.5 justify-center">
                                                <button className="hover:text-primary" type="button"
                                                        onClick={() => handleRemoveProductFromCart(index)}><Trash/>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div
                    className="rounded-sm border border-stroke bg-white px-5 pb-5 py-2 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                    <div className="border-b border-opacity-30">
                        <span className="text-sm text-black-2 font-bold mb-3 block">Thanh toán</span>
                    </div>
                    <div className="py-4">
                        <div className="grid grid-cols-3 gap-10">
                            <div className="grid grid-cols-2 gap-10 col-span-2">
                                <div>
                                    <div className="tracking-wide text-gray-700 text-sm font-bold mb-2">Hình thức nhận
                                        hàng
                                    </div>
                                    {/*<Radio label="Trực tiếp tại cửa hàng" name="shipping"*/}
                                    {/*       value="Trực tiếp tại cửa hàng"/>*/}
                                    {/*<Radio label="Giao hàng" name="shipping" value="Giao hàng"/>*/}

                                    <div className="flex flex-col gap-3">
                                        <label
                                            htmlFor="shipping1"
                                            className="text-slate-700 has-[:checked]:ring-blue-500 has-[:checked]:text-blue-500 has-[:checked]:bg-neutral-100 grid grid-cols-[24px_1fr_auto] items-center gap-6 rounded-lg p-3 ring-1 ring-transparent hover:bg-slate-100">
                                            <HandHelping/>
                                            Trực tiếp tại cửa hàng
                                            <input type="radio"
                                                   id="shipping1"
                                                   value="Banking"
                                                   name="shipping"
                                                   className="box-content h-1.5 w-1.5 appearance-none rounded-full border-[5px] border-white bg-white bg-clip-padding outline-none ring-1 ring-gray-950/10 checked:border-blue-500 checked:ring-blue-500"/>
                                        </label>
                                        <label
                                            htmlFor="shipping2"
                                            className="text-slate-700 has-[:checked]:ring-blue-500 has-[:checked]:text-blue-500 has-[:checked]:bg-neutral-100 grid grid-cols-[24px_1fr_auto] items-center gap-6 rounded-lg p-3 ring-1 ring-transparent hover:bg-slate-100">
                                            <Truck/>
                                            Giao hàng
                                            <input type="radio"
                                                   id="shipping2"
                                                   value="Momo"
                                                   name="shipping"
                                                   className="box-content h-1.5 w-1.5 appearance-none rounded-full border-[5px] border-white bg-white bg-clip-padding outline-none ring-1 ring-gray-950/10 checked:border-blue-500 checked:ring-blue-500"/>
                                        </label>
                                    </div>

                                </div>
                                <div>
                                    <div className="tracking-wide text-gray-700 text-sm font-bold mb-2">Hình thức thanh
                                        toán
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        <label
                                            htmlFor="paymentMoney"
                                            className="text-slate-700 has-[:checked]:ring-blue-500 has-[:checked]:text-blue-500 has-[:checked]:bg-neutral-100 grid grid-cols-[24px_1fr_auto] items-center gap-6 rounded-lg p-3 ring-1 ring-transparent hover:bg-slate-100">
                                            <CircleDollarSign/>
                                            Tiền mặt khi nhận hàng
                                            <input type="radio"
                                                   name="payment"
                                                   id="paymentMoney"
                                                   value="Money"
                                                   className="box-content h-1.5 w-1.5 appearance-none rounded-full border-[5px] border-white bg-white bg-clip-padding outline-none ring-1 ring-gray-950/10 checked:border-blue-500 checked:ring-blue-500"/>
                                        </label>
                                        <label
                                            htmlFor="paymentBanking"
                                            className="text-slate-700 has-[:checked]:ring-blue-500 has-[:checked]:text-blue-500 has-[:checked]:bg-neutral-100 grid grid-cols-[24px_1fr_auto] items-center gap-6 rounded-lg p-3 ring-1 ring-transparent hover:bg-slate-100">
                                            <CreditCard/>
                                            Chuyển khoản
                                            <input type="radio"
                                                   id="paymentBanking"
                                                   value="Banking"
                                                   name="payment"
                                                   className="box-content h-1.5 w-1.5 appearance-none rounded-full border-[5px] border-white bg-white bg-clip-padding outline-none ring-1 ring-gray-950/10 checked:border-blue-500 checked:ring-blue-500"/>
                                        </label>
                                        <label
                                            htmlFor="paymentMomo"
                                            className="text-slate-700 has-[:checked]:ring-blue-500 has-[:checked]:text-blue-500 has-[:checked]:bg-neutral-100 grid grid-cols-[24px_1fr_auto] items-center gap-6 rounded-lg p-3 ring-1 ring-transparent hover:bg-slate-100">
                                            <CreditCard/>
                                            Momo
                                            <input type="radio"
                                                   id="paymentMomo"
                                                   value="Momo"
                                                   name="payment"
                                                   className="box-content h-1.5 w-1.5 appearance-none rounded-full border-[5px] border-white bg-white bg-clip-padding outline-none ring-1 ring-gray-950/10 checked:border-blue-500 checked:ring-blue-500"/>
                                        </label>
                                    </div>
                                </div>


                                <div className="col-span-2">
                                    <TextArea label="Ghi chú" placeholder="Ví dụ: Giao sớm" name="note"
                                              feedback=""/>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 h-fit">
                                <div className="tracking-wide text-blue-500 text-lg font-bold">Tổng tiền hàng:</div>
                                <div className="tracking-widetext-blue-500 text-lg font-bold text-end">
                                    {new Intl.NumberFormat('vi-VN', {
                                        style: 'currency',
                                        currency: 'VND'
                                    }).format(totalPrice)}
                                </div>
                                <div className="tracking-wide text-red text-lg font-bold">Giảm giá:</div>
                                <div className="tracking-wide text-red text-lg font-bold text-end">
                                    {new Intl.NumberFormat('vi-VN', {
                                        style: 'currency',
                                        currency: 'VND'
                                    }).format(0)}
                                </div>
                                <div className="tracking-wide text-gray-500 text-lg font-bold">Phí vận chuyển:</div>
                                <div className="tracking-wide text-gray-500 text-lg font-bold text-end">
                                    {new Intl.NumberFormat('vi-VN', {
                                        style: 'currency',
                                        currency: 'VND'
                                    }).format(0)}
                                </div>
                                <div className="tracking-wide text-green-500 text-xl font-bold mb-2">Thành tiền:</div>
                                <div className="tracking-wide text-green-500 text-xl font-bold mb-2 text-end">
                                    {new Intl.NumberFormat('vi-VN', {
                                        style: 'currency',
                                        currency: 'VND'
                                    }).format(totalPrice)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-5 flex justify-end gap-3">
                    <Link href={"/orders"} className="btn btn-danger text-sm inline-flex items-center gap-2">
                        <span className="hidden xl:block">Hủy</span>
                    </Link>

                    <button className="btn btn-blue text-sm inline-flex items-center gap-2" type="submit">
                        <span className="hidden xl:block">{order ? "Đã thanh toán" : "Lưu"}</span>
                    </button>
                </div>
            </form>
        </Fragment>
    );
};

export default OrderForm;