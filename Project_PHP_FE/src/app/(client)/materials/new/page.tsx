import React from 'react';
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import {MaterialForm} from "@/components/Forms";

const CreateMaterialPage = () => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Thêm nguyên vật liệu"></Breadcrumb>
            <MaterialForm/>
        </DefaultLayout>
    );
};

export default CreateMaterialPage;