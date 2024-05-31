'use client'
import React, {useEffect, useState} from 'react';
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import {ImportMaterialReceipt, ImportMaterialReceiptDetail} from "@/models/Model";
import ImportMaterialReceiptForm from "@/components/Forms/ImportMaterialForm";
import {getData} from "@/services/APIService";

const EditImportMaterialReceiptPage = ({params} : {params: {id: string}}) => {
    const [receipt, setReceipt] = useState<ImportMaterialReceipt>();
    const [receiptDetails, setReceiptDetails] = useState<ImportMaterialReceiptDetail[]>();
    const getImportMaterialReceipt = async () => {
        const data : ImportMaterialReceipt = await getData(`http://localhost:8000/api/v1/material_import_receipts/${params.id}`);
        setReceipt(data);
    }

    const getImportMaterialReceiptDetails = async () => {
        const data : ImportMaterialReceiptDetail[] = await getData(`http://localhost:8000/api/v1/material_import_receipts/${params.id}/details`);
        setReceiptDetails(data);
    }


    useEffect(() => {
        getImportMaterialReceipt();
        getImportMaterialReceiptDetails();
    }, []);
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Cập nhật nhập kho nguyên vật liệu"/>
            <ImportMaterialReceiptForm receipt={receipt} receiptDetails={receiptDetails}/>
        </DefaultLayout>
    );
};

export default EditImportMaterialReceiptPage;