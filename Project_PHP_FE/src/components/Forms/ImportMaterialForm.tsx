"use client";
import React, {FormEvent, Fragment, useEffect, useRef, useState} from 'react';
import Input from "@/components/Inputs/Input";
import Select from "@/components/Inputs/Select";
import {CircleHelp, Eye, ImageUp, Trash} from "@/components/Icons";
import SearchInput from "@/components/Inputs/SearchInput";
import Image from "next/image";
import TextArea from "@/components/Inputs/TextArea";
import Tooltip from "@/components/comon/Tooltip";
import Alert from "@/components/Alert";
import {useRouter} from "next/navigation";
import Link from "next/link";
import {ImportMaterialReceipt, ImportMaterialReceiptDetail, Material} from "@/models/Model";
import SuccessModal from "@/components/Modal/SuccessModal";
import InputDefault from "@/components/Inputs/InputDefault";
import {getData} from "@/services/APIService";
import {API_GET_ALL_MATERIALS} from "@/config/api";
import ContainerModal from "@/components/Modal/ContainerModal";
import HeaderModal from "@/components/Modal/HeaderModal";
import BodyModal from "@/components/Modal/BodyModal";
import FooterModal from "@/components/Modal/FooterModal";

interface Props {
    receipt?: ImportMaterialReceipt;
    receiptDetails?: ImportMaterialReceiptDetail[];
}
const modalColumns: string[] = ["Nguyên vật liệu", "Khối lượng", "Đơn vị tính", "Trạng thái"];

const ImportMaterialReceiptForm = ({receipt, receiptDetails} : Props) => {
    const router = useRouter();
    const columns: string[] = ["Nguyên vật liệu", "Số lượng", "Đơn vị tính", "Khối lượng" ,"Đơn giá (đ)", "Thành tiền (đ)", ""];
    const [previewIndex, setPreviewIndex] = useState<number | null>(null);
    const inputProductImage = useRef<HTMLInputElement | null>(null);
    const [images, setImages] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [insertSuccess, setInsertSuccess] = useState<boolean>(false);

    const [showSearchProductModal, setShowSearchProductModal] = useState<boolean>(false);
    const [searchInput, setSearchInput] = useState<string>('')
    const [searchInputInModal, setSearchInputInModal] = useState<string>('')
    const searchInputInModalRef = useRef<HTMLInputElement>(null);
    const [materialName, setMaterialName] = useState<string>("");
    // Danh sách nguyên liệu tìm kiếm
    const [materialsInModal, setMaterialsInModal] = useState<Material[]>([])

    // Danh sách nguyên liệu nhập
    const [materials, setMaterials] = useState<Material[]>([])

    const handleSearchMaterialByProductName = async () => {
        if (materialName !== '') {
            const data: Material[] = await getData(API_GET_ALL_MATERIALS + "?name=" + materialName);
            setMaterialsInModal(data)
        }

    }

    const openInputImage = () => {
        inputProductImage.current?.click();
    }

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        const newImages: string[] = [];
        if (files) {
            for (let i = 0; i < files.length; i++) {
                const reader = new FileReader();
                reader.onload = () => {
                    if (reader.result) {
                        newImages.push(reader.result.toString());
                        if (newImages.length === files.length) {
                            setImages([...images, ...newImages]);
                        }
                    }
                }
                reader.readAsDataURL(files[i]);
            }
        }
        console.log(newImages);
    }
    const handleChangeSearchInput = (event : React.ChangeEvent<HTMLInputElement>) => {
        if (!showSearchProductModal && searchInputInModalRef.current) {
            setShowSearchProductModal(true);
            setSearchInputInModal(event.target.value);
            searchInputInModalRef.current.focus();
        }
    }

    const handleDragStart = (index: number) => (event : React.DragEvent<HTMLDivElement>) => {
        event.dataTransfer.setData('index', index.toString());
    }

    const handleDrag = (index: number) => (event : React.DragEvent<HTMLDivElement>) => {
        const draggedIndex = Number(event.dataTransfer.getData("index"));
        const newImages = [...images];
        const [draggedImage] = newImages.splice(draggedIndex, 1);
        newImages.splice(index, 0, draggedImage);
        setImages(newImages);
    }

    const onSubmitMaterialForm = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const name : string = formData.get('name') as string;
        const provider : string = formData.get('provider') as string;

        if (name.trim() === '') {
            setError('Tên nguyên vật liệu là bắt buộc');
            return;
        }
        if (provider.trim() === '') {
            setError('Nhà cung cấp là bắt buộc');
            return;
        }

        const method = (receipt ? "PUT" : "POST");

        const response = await fetch(`http://localhost:8000/api/v1/materials${receipt?.id ? "/" + receipt.id : ''}`,
            {
                method: method,
                body: JSON.stringify(Object.fromEntries(formData)),
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
        const getExampleMaterials = async () => {
            const data : Material[] = await getData(API_GET_ALL_MATERIALS);
            setMaterials(data);
        }

    }, []);

    return (
        <Fragment>
            {
                showSearchProductModal && (
                    <ContainerModal>
                        <HeaderModal title="Tìm kiếm sản phẩm" onClose={() => setShowSearchProductModal(false)}/>
                        <BodyModal>
                            <div className="grid grid-cols-12 gap-3">
                                <div className="col-span-11">
                                    <InputDefault placeholder="Nhập tên" ref={searchInputInModalRef}
                                                  value={materialName} type="text" name="search"
                                                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMaterialName(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <button
                                        onClick={handleSearchMaterialByProductName}
                                        className="bg-blue-500 hover:bg-blue-700 text-white w-full font-bold py-1 px-4 rounded">Tìm
                                    </button>
                                </div>
                            </div>
                            <div className="pt-5">
                                <div className="overflow-x-auto min-w-[900px]">
                                    <table className="w-full table-auto">
                                        <thead>
                                        <tr className="bg-gray-2 text-left text-xs dark:bg-meta-4">
                                            <th className="min-w-[50px] px-2 py-2 font-medium text-black dark:text-white border-[#eee] border">
                                                <div className="flex justify-center">
                                                    <input type="checkbox"/>
                                                </div>
                                            </th>
                                            {
                                                modalColumns.map((modalColumns: string, index: number) => (
                                                    <th key={"columns-" + index}
                                                        className="min-w-[50px] px-2 py-2 font-medium text-black dark:text-white  border-[#eee] border text-center">
                                                        {modalColumns}
                                                    </th>
                                                ))
                                            }
                                        </tr>
                                        </thead>
                                        <tbody className="text-left">
                                        {materialsInModal.map((material: Material, key: number) => (
                                            <tr key={key} className="text-xs border border-[#eee]">
                                                <td className="border border-[#eee] px-2 py-3 dark:border-strokedark border-x">
                                                    <div className="flex justify-center">
                                                        <input type="checkbox"/>
                                                    </div>
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
                                                            <a href={`/materials/${material.id}`} target="_blank"
                                                               className="font-bold text-sm text-blue-600 block mb-1">{material.name}</a>
                                                            <div>ID: {material.id}</div>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="px-2 py-3 dark:border-strokedark border border-[#eee] text-center">
                                                    {material.weight} kg
                                                </td>
                                                <td className="px-2 py-3 dark:border-strokedark border border-[#eee] text-center">
                                                    {material.unit}
                                                </td>
                                                <td className="px-2 py-3 dark:border-strokedark border border-[#eee] text-center">
                                                    {material.status === "IN_STOCK" ? "Đang bán" : material.status === "TEMPORARILY_SUSPENDED" ? "Tạm ngưng" : "Hết hàng"}
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </BodyModal>
                        <FooterModal messageRightBtn="Nhập"/>
                    </ContainerModal>
                )
            }
            {
                insertSuccess && <SuccessModal title="Thành công" message="Thêm nguyên vật liệu thành công" onClickLeft={() => {router.back()}} onClickRight={() => {}}/>
            }
            <form onSubmit={onSubmitMaterialForm}>
                {
                    error && <Alert message={error} type="error"/>
                }
                <div
                    className="rounded-sm border border-stroke bg-white px-5 pb-2.5 py-2 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                    <div className="border-b border-opacity-30">
                        <span className="text-sm text-black-2 font-bold mb-3 block">Thông tin chung</span>
                    </div>

                    <div className="py-2">
                        <Input label="Mã hóa đơn" feedback="Mã hóa đơn là bắt buộc"
                               placeholder="Nhập mã hóa đơn"
                               defaultValue={receipt?.id}
                               type="text" name=""/>

                        <SearchInput label="Tên kho nguyên vật liệu" placeholder="Chọn tên kho" name="provider"/>

                        <div className="grid grid-cols-2 gap-3">
                            <Input label="Ngày nhập" feedback="Ngày nhập"
                                   placeholder="Nhập ngày nhập"
                                   type="date" name="receipt_date"
                                   defaultValue={receipt?.receipt_date && new Date(receipt?.receipt_date).toISOString().split('T')[0]}/>

                            <Select label="Loại" name="" defaultValue="NORMAL">
                                <option value="NORMAL">Thông thường</option>
                                <option value="RETURN">Hoàn trả</option>
                            </Select>
                        </div>

                        <div>
                            <TextArea label="Ghi chú" placeholder="Nhập ghi chú" name="note" feedback=""
                                      defaultValue={''}/>
                        </div>
                    </div>

                </div>
                <div
                    className="rounded-sm border border-stroke bg-white mt-5 px-5 pb-2.5 py-2 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                    <div className="border-b border-opacity-30">
                        <span className="text-sm text-black-2 font-bold mb-3 block">Nguyên vật liệu</span>
                    </div>
                    <div className="flex flex-col gap-2 py-3">
                        <div className="flex flex-row justify-between gap-2 items-center">
                            <InputDefault placeholder="Nhập SKU hoặc tên nguyên vật liệu" type="text" name=""
                                          onChange={handleChangeSearchInput}/>
                            <button className="appearance-none rounded px-4 py-1 btn-blue" type="button"
                                    onClick={() => setShowSearchProductModal(true)}>Tìm
                            </button>
                        </div>
                        <div className="flex flex-col gap-2">
                            <table className="w-full table-auto">
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
                                {
                                    receiptDetails?.map((details: ImportMaterialReceiptDetail) => (
                                        <tr key={details.material.id} className="text-xs border border-[#eee]">
                                            <td className="px-2 py-3 dark:border-strokedark">
                                                <div className="flex flex-row gap-2">
                                                    <div>
                                                        <Image src={"/images/default/no-image.png"} alt="" width={50}
                                                               height={50}
                                                               className="rounded border border-opacity-30 aspect-square object-cover"/>
                                                    </div>
                                                    <div>
                                                        <a href={`/materials/${details.material.id}`} target="_blank"
                                                           className="font-bold text-sm text-blue-600 block mb-1">{details.material.name}</a>
                                                        <div>SKU: {details.material.id}</div>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-2 py-3 dark:border-strokedark border border-[#eee] text-center">
                                                <input defaultValue={1} min={0} type="number"
                                                       className="border border-t-body rounded focus:outline-blue-500 py-1 px-3 text-sm"/>
                                            </td>

                                            <td className="px-2 py-3 dark:border-strokedark border border-[#eee] text-center">
                                                {details.material.unit}
                                            </td>

                                            <td className="px-2 py-3 dark:border-strokedark border border-[#eee] text-center">
                                                {details.material.weight} kg
                                            </td>

                                            <td className="px-2 py-3 dark:border-strokedark border border-[#eee] text-center">
                                                <h5 className="font-medium text-black dark:text-white">
                                                    {/*{new Intl.NumberFormat('vi-VN', {*/}
                                                    {/*    style: 'currency',*/}
                                                    {/*    currency: 'VND'*/}
                                                    {/*}).format(details.price)}*/}

                                                    <input defaultValue={1} min={0} type="number"
                                                           className="border border-t-body rounded focus:outline-blue-500 py-1 px-3 text-sm"/>
                                                </h5>
                                            </td>
                                            <td className="px-2 py-3 dark:border-strokedark text-end">
                                                <h5 className="font-medium text-black dark:text-white">
                                                    {new Intl.NumberFormat('vi-VN', {
                                                        style: 'currency',
                                                        currency: 'VND'
                                                    }).format(details.price * details.quantity)}
                                                </h5>
                                            </td>

                                            <td className="px-2 py-3 dark:border-strokedark border border-[#eee]">
                                                <div className="flex items-center space-x-3.5 justify-center">
                                                    <button className="hover:text-primary" type="button"><Trash/>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div
                    className="rounded-sm border border-stroke bg-white mt-5 px-5 pb-5 py-2 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
                    <div className="border-b border-opacity-30 ">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-sm text-black-2 font-bold block">Hình ảnh sản phẩm</span>
                            <Tooltip message="Hình ảnh dạng jpg, png tỉ lệ 1:1 (hình vuông)">
                                <CircleHelp stroke="#27c1f0"/>
                            </Tooltip>
                        </div>
                    </div>
                    <div className="border border-dotted rounded mt-5 py-5">
                        <div className="flex flex-col items-center">
                            <input type="file" ref={inputProductImage} className="hidden" accept="image/*"
                                   onChange={handleImageChange}/>

                            <div className="flex gap-2">
                                {
                                    images.map((image: string, index: number) => (
                                        <div
                                            key={index} className="border relative rounded aspect-square cursor-move"
                                            onDragStart={handleDragStart(index)}
                                            onDragOver={(event: React.DragEvent<HTMLDivElement>) => event.preventDefault()}
                                            onDrag={handleDrag(index)}
                                            draggable
                                        >
                                            <Image src={image} alt={`Product ${index + 1}`} className="object-cover"
                                                   width={200} height={200} onClick={() => setPreviewIndex(index)}/>
                                            <div
                                                className="absolute inset-0 flex flex-row justify-center items-center opacity-0 hover:bg-[#31373dbf] hover:opacity-100 transition-opacity">
                                                <button onClick={() => setPreviewIndex(index)}
                                                        className="px-4 py-2 m-1">
                                                    <Eye className="text-white"/>
                                                </button>
                                                <button className="px-4 py-2 m-1">
                                                    <Trash className="text-white"/>
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                }

                                {previewIndex !== null && (
                                    <div
                                        className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-999999">
                                        <div className="max-w-lg max-h-96 overflow-hidden">
                                            <Image src={images[previewIndex]} alt={`Preview ${previewIndex + 1}`}
                                                   width={600} height={600}/>
                                            <button className="absolute top-2 right-2 text-white"
                                                    onClick={() => setPreviewIndex(null)}>
                                                Close
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <ImageUp/>
                            <span className="text-blue-700 font-bold text-sm py-2 cursor-pointer"
                                  onClick={openInputImage}>Thêm ảnh</span>
                            <span className="text-blue-700 font-bold text-xs cursor-pointer">Thêm  từ URL <span
                                className="text-body">(Hình ảnh/Video)</span></span>
                        </div>
                    </div>
                </div>

                <div className="mt-5 flex justify-end gap-3">
                    <Link href={"/receipts/import-materialsInModal"} className="btn btn-danger text-sm inline-flex items-center gap-2">
                        <span className="hidden xl:block">Hủy</span>
                    </Link>

                    <button type="submit" className="btn btn-blue text-sm inline-flex items-center gap-2">
                        <span className="hidden xl:block">{receipt ? "Cập nhật" : "Lưu"}</span>
                    </button>
                </div>
            </form>
        </Fragment>

    );
};

export default ImportMaterialReceiptForm;