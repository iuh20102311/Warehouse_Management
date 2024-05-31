"use client";
import React, {FormEvent, Fragment, useEffect, useRef, useState} from 'react';
import Input from "@/components/Inputs/Input";
import Select from "@/components/Inputs/Select";
import {CircleHelp, Eye, ImageUp, Trash} from "@/components/Icons";
import Tooltip from "@/components/comon/Tooltip";
import Image from "next/image";
import Editor from "@/components/Inputs/Editor";
import Alert from "@/components/Alert";
import {usePathname, useRouter} from "next/navigation";
import Link from "next/link";
import SuccessModal from "@/components/Modal/SuccessModal";
import InputMoney from "@/components/Inputs/InputMoney";
import {Product} from "@/models/Product";

interface Props {
    product?: Product;
}
const ProductForm = ({product} : Props) => {
    const router = useRouter();
    const pathname = usePathname();
    const [previewIndex, setPreviewIndex] = useState<number | null>(null);
    const inputProductImage = useRef<HTMLInputElement | null>(null);
    const [images, setImages] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [description, setDescription] = useState<string>("");
    const [insertSuccess, setInsertSuccess] = useState<boolean>(false);

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

    const handleDragStart = (index: number) => (event: React.DragEvent<HTMLDivElement>) => {
        event.dataTransfer.setData('index', index.toString());
    }

    const handleDrag = (index: number) => (event: React.DragEvent<HTMLDivElement>) => {
        const draggedIndex = Number(event.dataTransfer.getData("index"));
        const newImages = [...images];
        const [draggedImage] = newImages.splice(draggedIndex, 1);
        newImages.splice(index, 0, draggedImage);
        setImages(newImages);
    }

    const onSubmitProductForm = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        formData.append('description', description);
        const name: string = formData.get('name') as string;
        const sku: string = formData.get('sku') as string;
        const packing: string = formData.get('packing') as string;

        if (name.trim() === '') {
            setError('Tên sản phẩm là bắt buộc');
            return;
        }
        if (sku.trim() === '') {
            setError('Mã sản phẩm là bắt buộc');
            return;
        }
        if (packing.trim() === '') {
            setError('Quy cách đóng gói là bắt buộc');
            return;
        }
        let price : string = formData.get('price') as string;
        price = price.replace(/\D/g, '');
        formData.set('price', price)

        const method = (product ? "PUT" : "POST");
        const response = await fetch(`http://localhost:8000/api/v1/products${product?.id ? "/" + product.id : ''}`,
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
        setDescription(product?.description ? product.description : description);
    }, [product]);

    return (
        <Fragment>
            {
                insertSuccess && (
                    pathname.toString().includes('new') ?
                        <SuccessModal title="Thành công" message="Thêm sản phẩm thành công" onClickLeft={() => {router.back()}} onClickRight={() => {}}/> :
                        <SuccessModal title="Thành công" message="Cập nhật sản phẩm thành công" onClickLeft={() => {router.back()}} onClickRight={() => {}}/>
                )
            }
            <form onSubmit={onSubmitProductForm}>
                {
                    error && <Alert message={error} type="error"/>
                }
                <div
                    className="rounded-sm border border-stroke bg-white px-5 pb-2.5 py-2 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                    <div className="border-b border-opacity-30">
                        <span className="text-sm text-black-2 font-bold mb-3 block">Thông tin chung</span>
                    </div>

                    <div className="py-2">

                        <div className="grid sm:grid-cols-2 sm:gap-3 xsm:grid-cols-1 xsm:gap-0">
                            <Input label="Mã sản phẩm" feedback="Mã là bắt buộc" placeholder="Nhập mã sản phẩm"
                                   type="text" name="sku" defaultValue={product?.sku}/>
                            <Input label="Tên sản phẩm" feedback="Tên sản phẩm là bắt buộc"
                                   placeholder="Nhập tên sản phẩm"
                                   type="text" name="name" defaultValue={product?.name}/>
                        </div>
                        <div className="grid sm:grid-cols-2 xsm:grid-cols-1 xsm:gap-0 sm:gap-3">
                            <InputMoney label="Giá sản phẩm" placeholder="Nhập giá sản phẩm" name="price" value={product?.price}/>

                            <Input label="Số lượng" feedback="Số lượng hiện có là bắt buộc"
                                   placeholder="Nhập số lượng sản phẩm"
                                   defaultValue={product?.quantity}
                                   type="number" name="quantity" min={0}/>
                        </div>
                        <div className="grid lg:grid-cols-3 sm:gap-3 xsm:grid-cols-1 xsm:gap-0">
                            <Input label="Khối lượng" feedback="Khối lượng là bắt buộc"
                                   placeholder="Nhập khối lượng sản phẩm"
                                   type="number"
                                   defaultValue={product?.weight}
                                   name="weight" min={0}/>

                            <Input label="Quy cách đóng gói" feedback="Quy cách đóng gói là bắt buộc"
                                   placeholder="Nhập quy cách đóng gói"
                                   defaultValue={product?.packing}
                                   type="text" name="packing"/>

                            <Select label="Trạng thái" name="status" defaultValue={product?.status}>
                                <option value="IN_STOCK">Đang bán</option>
                                <option value="TEMPORARILY_SUSPENDED">Tạm ngưng</option>
                                <option value="OUT_OF_STOCK">Hết hàng</option>
                            </Select>
                        </div>

                        <div>
                            <Editor placeholder="Nhập mô tả" content={description} setContent={setDescription}/>
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
                    <Link href={"/products"} className="btn btn-danger text-sm inline-flex items-center gap-2">
                        <span className="hidden xl:block">Hủy</span>
                    </Link>

                    <button type="submit" className="btn btn-blue text-sm inline-flex items-center gap-2">
                        <span className="hidden xl:block">{product ? "Cập nhật" : "Lưu"}</span>
                    </button>
                </div>
            </form>
        </Fragment>
    );
};

export default ProductForm;