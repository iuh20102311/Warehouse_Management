'use client'
import React, {useEffect, useState} from 'react';
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import {
    ExportProductReceipt,
    ExportProductReceiptDetail
} from "@/models/Model";
import {getData} from "@/services/APIService";
import ExportProductReceiptForm from "@/components/Forms/ExportProductForm";

const EditExportProductReceiptPage = ({params} : {params: {id: string}}) => {
    const [receipt, setReceipt] = useState<ExportProductReceipt>();
    const [receiptDetails, setReceiptDetails] = useState<ExportProductReceiptDetail[]>();
    const getExportProductReceipt = async () => {
        const data : ExportProductReceipt = await getData(`http://localhost:8000/api/v1/product_export_receipts/${params.id}`);
        setReceipt(data);
    }

    const getExportProductReceiptDetails = async () => {
        const data : ExportProductReceiptDetail[] = await getData(`http://localhost:8000/api/v1/product_export_receipts/${params.id}/details`);
        setReceiptDetails(data);
    }


    useEffect(() => {
        getExportProductReceipt();
        getExportProductReceiptDetails();
    }, []);
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Cập nhật xuất kho thành phẩm"/>
            <ExportProductReceiptForm receipt={receipt} receiptDetails={receiptDetails}/>
        </DefaultLayout>
    );
};

export default EditExportProductReceiptPage;