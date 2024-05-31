"use client";
import React, {FormEvent, Fragment, useEffect, useRef, useState} from 'react';
import Input from "@/components/Inputs/Input";
import Select from "@/components/Inputs/Select";
import {CircleHelp, Eye, ImageUp, Trash} from "@/components/Icons";
import Image from "next/image";
import TextArea from "@/components/Inputs/TextArea";
import Tooltip from "@/components/comon/Tooltip";
import Alert from "@/components/Alert";
import {useRouter} from "next/navigation";
import Link from "next/link";
import {Material} from "@/models/Model";
import SuccessModal from "@/components/Modal/SuccessModal";

interface Props {
    material?: Material;
}

const MaterialForm = ({material} : Props) => {
    const router = useRouter();
    const [previewIndex, setPreviewIndex] = useState<number | null>(null);
    const inputProductImage = useRef<HTMLInputElement | null>(null);
    const [images, setImages] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [insertSuccess, setInsertSuccess] = useState<boolean>(false);
    const [selectedStatus, setSelectedStatus] = useState<string>("ACTIVE");

    useEffect(() => {
        if (material) {
            setSelectedStatus(material.status);
        }
    }, [material]);
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

        if (name.trim() === '') {
            setError('Tên nguyên vật liệu là bắt buộc');
            return;
        }

        const method = (material ? "PUT" : "POST");

        const response = await fetch(`http://localhost:8000/api/v1/materials${material?.id ? "/" + material.id : ''}`,
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

    return (
        <Fragment>
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
                        <Input label="Tên nguyên vật liệu" feedback="Tên nguyên vật liệu là bắt buộc"
                               placeholder="Nhập tên nguyên vật liệu"
                               defaultValue={material?.name}
                               type="text" name="name"/>

                        {/*<SearchInput label="Nhà cung cấp" placeholder="Chọn nhà cung cấp" name="provider"/>*/}

                        <div className="grid grid-cols-2 gap-3">
                            <Input label="Xuất xứ" feedback="Xuất xứ của nguyên vật liệu"
                                   placeholder="Xuất xứ"
                                   defaultValue={material?.origin}
                                   type="text" name="origin"/>

                            <Input label="Số lượng" feedback="Số lượng hiện có là bắt buộc"
                                   placeholder="Nhập số lượng sản phẩm"
                                   defaultValue={material?.quantity}
                                   type="number" name="quantity" min={0}/>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                            <Input label="Khối lượng" feedback="Khối lượng là bắt buộc"
                                   placeholder="Nhập khối lượng sản phẩm"
                                   defaultValue={material?.weight}
                                   type="number"
                                   name="weight" min={0}/>

                            <Select label="Đơn vị" name="unit" defaultValue="Thùng">
                                <option value="Thùng">Thùng</option>
                                <option value="Bao">Bao</option>
                                <option value="Túi">Túi</option>
                            </Select>

                            <Select label="Trạng thái" name="status" value={selectedStatus} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedStatus(e.target.value)}>
                                <option value="IN_STOCK">Đang bán</option>
                                <option value="TEMPORARILY_SUSPENDED">Tạm ngưng</option>
                                <option value="OUT_OF_STOCK">Hết hàng</option>
                            </Select>
                        </div>
                        <div>
                            <TextArea label="Ghi chú" placeholder="Nhập ghi chú" name="note" feedback=""
                                      defaultValue={material?.note}/>
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
                    <Link href={"/materials"} className="btn btn-danger text-sm inline-flex items-center gap-2">
                        <span className="hidden xl:block">Hủy</span>
                    </Link>

                    <button type="submit" className="btn btn-blue text-sm inline-flex items-center gap-2">
                        <span className="hidden xl:block">{material ? "Cập nhật" : "Lưu"}</span>
                    </button>
                </div>
            </form>
        </Fragment>

    );
};

export default MaterialForm;