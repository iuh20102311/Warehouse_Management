import React, {useEffect, useState} from 'react';
import HeaderModal from "@/components/Modal/HeaderModal";
import BodyModal from "@/components/Modal/BodyModal";
import Image from "next/image";
import ContainerModal from "@/components/Modal/ContainerModal";
import {getData} from "@/services/APIService";
import {Product} from "@/models/Product";
import {ImportProductReceipt} from "@/models/Model";

interface ViewReceiptProductModalProps {
    onClose: () => void;
    receipt: ImportProductReceipt;
}

const columns: string[] = ["Sản phẩm", "Quy cách đóng gói", "Trọng lượng", "Số  lượng nhập","Sẵn có", "Giá (đ)"];

interface ProductImportReceiptDetail {
    id: number;
    product_import_receipt_id: number;
    quantity: number;
    created_at: Date;
    updated_at: Date;
    product: Product;
}
const ViewReceiptProductModal = ({onClose, receipt}: ViewReceiptProductModalProps) => {
    const [receiptDetails, setReceiptDetails] = useState<ProductImportReceiptDetail[]>([]);
    const getDetails = async () => {
        const details : ProductImportReceiptDetail[] = await getData(`http://localhost:8000/api/v1/product_import_receipts/${receipt.id}/details`);
        setReceiptDetails(details);
    }

    useEffect(() => {
        if (receipt) {
            getDetails();
        }
    }, []);

    return (
        <ContainerModal>
            <HeaderModal title="Chi tiết nhập kho" onClose={onClose}/>
            <BodyModal>
                <div className="grid grid-cols-4 gap-x-10 gap-y-3">
                    <div className="font-bold">Mã hóa đơn:</div>
                    <div>{receipt.id}</div>
                    <div className="font-bold">Loại nhập:</div>
                    <div>{receipt.type === 'NORMAL' ? 'Nhập kho thông thường' : 'Nhập kho hoàn trả'}</div>
                    <div className="font-bold">Ngày nhập:</div>
                    <div>{new Date(receipt.receipt_date).toLocaleDateString()}</div>
                    <div className="font-bold">Kho:</div>
                    <div>{receipt.warehouse.name}</div>
                    <div className="col-span-4">
                        <span className="font-bold">Note:</span> {receipt.note}
                    </div>
                </div>
                <div className="overflow-auto sm:min-h-100 xsm:min-h-screen my-5">
                    <table className="w-full min-w-[950px] max-h-550 table-auto">
                        <thead>
                        <tr className="bg-gray-2 text-left text-xs dark:bg-meta-4">
                            {
                                columns.map((modalColumns: string, index: number) => (
                                    <th key={"columns-" + index}
                                        className="min-w-[50px] px-2 py-2 font-medium text-black dark:text-white  border-[#eee] border text-center">
                                        {modalColumns}
                                    </th>
                                ))
                            }
                        </tr>
                        </thead>
                        <tbody className="text-left">
                        {
                            receiptDetails && (
                                receiptDetails.map((detail: ProductImportReceiptDetail, index: number) => (
                                    <tr key={index} className="text-xs border border-[#eee]">
                                        <td className="border border-[#eee] px-2 py-3 dark:border-strokedark">
                                            <div className="flex flex-row gap-2">
                                                <div>
                                                    <Image src={"/images/default/no-image.png"} alt=""
                                                           width={50}
                                                           height={50}
                                                           className="rounded border border-opacity-30 aspect-square object-cover"/>
                                                </div>
                                                <div>
                                                    <a href={`/products/${detail.product.sku}`} target="_blank"
                                                       className="font-bold text-sm text-blue-600 block mb-1">{detail.product.name}</a>
                                                    <div>SKU: {detail.product.sku}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-2 py-3 dark:border-strokedark border border-[#eee] text-center">
                                            {detail.product.packing}
                                        </td>
                                        <td className="px-2 py-3 dark:border-strokedark border border-[#eee] text-center">
                                            {detail.product.weight} g
                                        </td>
                                        <td className="px-2 py-3 dark:border-strokedark border border-[#eee] text-center">
                                            {detail.quantity}
                                        </td>
                                        <td className="px-2 py-3 dark:border-strokedark border border-[#eee] text-center">
                                            {detail.product.quantity}
                                        </td>

                                        <td className="px-2 py-3 dark:border-strokedark border border-[#eee]">
                                            <h5 className="font-medium text-black dark:text-white text-end">
                                                {new Intl.NumberFormat('vi-VN', {
                                                    style: 'currency',
                                                    currency: 'VND'
                                                }).format(detail.product.price)}
                                            </h5>
                                        </td>
                                    </tr>
                                ))
                            )
                        }
                        </tbody>
                    </table>
                </div>
            </BodyModal>
            <div className="flex justify-end gap-2">
                <button className="btn bg-[#e3e9ed] py-1" onClick={onClose}>Hủy</button>
            </div>
        </ContainerModal>
    );
};

export default ViewReceiptProductModal;