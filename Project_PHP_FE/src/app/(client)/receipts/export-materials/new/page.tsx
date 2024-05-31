import React from 'react';
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import ExportMaterialForm from "@/components/Forms/ExportMaterialForm";

const CreateExportMaterialPage = () => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Xuất kho nguyên vật liệu"></Breadcrumb>
            <ExportMaterialForm/>
        </DefaultLayout>
    );
};

export default CreateExportMaterialPage;