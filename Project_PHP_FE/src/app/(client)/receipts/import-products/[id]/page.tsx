'use client'
import React, {useEffect, useState} from 'react';
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import {
    ImportMaterialReceipt,
    ImportMaterialReceiptDetail,
    ImportProductReceipt,
    ImportProductReceiptDetail
} from "@/models/Model";
import ImportMaterialReceiptForm from "@/components/Forms/ImportMaterialForm";
import {getData} from "@/services/APIService";
import ImportProductReceiptForm from "@/components/Forms/ImportProductForm";

const EditImportProductReceiptPage = ({params} : {params: {id: string}}) => {
    const [receipt, setReceipt] = useState<ImportProductReceipt>();
    const [receiptDetails, setReceiptDetails] = useState<ImportProductReceiptDetail[]>();
    const getImportProductReceipt = async () => {
        const data : ImportProductReceipt = await getData(`http://localhost:8000/api/v1/product_import_receipts/${params.id}`);
        setReceipt(data);
    }

    const getImportProductReceiptDetails = async () => {
        const data : ImportProductReceiptDetail[] = await getData(`http://localhost:8000/api/v1/product_import_receipts/${params.id}/details`);
        setReceiptDetails(data);
    }


    useEffect(() => {
        getImportProductReceipt();
        getImportProductReceiptDetails();
    }, []);
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Cập nhật nhập kho thành phẩm"/>
            <ImportProductReceiptForm receipt={receipt} receiptDetails={receiptDetails}/>
        </DefaultLayout>
    );
};

export default EditImportProductReceiptPage;