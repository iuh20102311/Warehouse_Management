import React from 'react';
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import ImportProductReceiptForm from "@/components/Forms/ImportProductForm";

const CreateImportProductPage = () => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Nhập kho thành phẩm"></Breadcrumb>
            <ImportProductReceiptForm/>
        </DefaultLayout>
    );
};

export default CreateImportProductPage;