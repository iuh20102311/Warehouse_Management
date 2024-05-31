import React from 'react';
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import {CustomerForm} from "@/components/Forms";

const CreateCustomerPage = () => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Thêm khách hàng"/>
            <CustomerForm/>
        </DefaultLayout>
    );
};

export default CreateCustomerPage;