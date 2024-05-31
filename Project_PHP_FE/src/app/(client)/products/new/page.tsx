import React from 'react';
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import {ProductForm} from "@/components/Forms";

const CreateProductPage = () => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Thêm sản phẩm"/>
            <ProductForm/>
        </DefaultLayout>
    );
};

export default CreateProductPage;