import React from 'react';
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import OrderForm from "@/components/Forms/OrderForm";
import {ProviderForm} from "@/components/Forms";

const CreateProviderPage = () => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Thêm nhà cung cấp"/>
            <ProviderForm/>
        </DefaultLayout>
    );
};

export default CreateProviderPage;