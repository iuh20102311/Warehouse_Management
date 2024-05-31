import React from 'react';
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import OrderForm from "@/components/Forms/OrderForm";

const CreateOrderPage = () => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Tạo đơn hàng"/>
            <OrderForm/>
        </DefaultLayout>
    );
};

export default CreateOrderPage;