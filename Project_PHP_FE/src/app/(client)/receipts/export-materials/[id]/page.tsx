'use client'
import React, {useEffect, useState} from 'react';
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import {
    ExportMaterialReceipt,
    ExportMaterialReceiptDetail,
} from "@/models/Model";
import {getData} from "@/services/APIService";
import ExportMaterialForm from "@/components/Forms/ExportMaterialForm";

const EditExportMaterialReceiptPage = ({params} : {params: {id: string}}) => {
    const [receipt, setReceipt] = useState<ExportMaterialReceipt>();
    const [receiptDetails, setReceiptDetails] = useState<ExportMaterialReceiptDetail[]>();
    const getExportMaterialReceipt = async () => {
        const data : ExportMaterialReceipt = await getData(`http://localhost:8000/api/v1/material_export_receipts/${params.id}`);
        setReceipt(data);
    }

    const getExportMaterialReceiptDetails = async () => {
        const data : ExportMaterialReceiptDetail[] = await getData(`http://localhost:8000/api/v1/material_export_receipts/${params.id}/details`);
        setReceiptDetails(data);
    }


    useEffect(() => {
        getExportMaterialReceipt();
        getExportMaterialReceiptDetails();
    }, []);
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Cập nhật xuất kho nguyên vật liệu"/>
            <ExportMaterialForm receipt={receipt} receiptDetails={receiptDetails}/>
        </DefaultLayout>
    );
};

export default EditExportMaterialReceiptPage;