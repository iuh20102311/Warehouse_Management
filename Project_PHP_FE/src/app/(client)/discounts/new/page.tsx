import React from 'react';
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import {EmployeeForm, DiscountForm} from "@/components/Forms";

const CreateDiscountPage = () => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Thêm khuyến mãi"/>
            <DiscountForm/>
        </DefaultLayout>
    );
};

export default CreateDiscountPage;