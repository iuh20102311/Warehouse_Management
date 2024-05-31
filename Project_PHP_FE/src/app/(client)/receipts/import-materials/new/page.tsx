import React from 'react';
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import ImportMaterialReceiptForm from "@/components/Forms/ImportMaterialForm";

const CreateImportMaterialPage = () => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Nhập kho nguyên vật liệu"></Breadcrumb>
            <ImportMaterialReceiptForm/>
        </DefaultLayout>
    );
};

export default CreateImportMaterialPage;