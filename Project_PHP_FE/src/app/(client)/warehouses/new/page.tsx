import React from 'react';
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import {ProviderForm, WarehouseForm} from "@/components/Forms";

const CreateWarehousePage = () => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Thêm nhà kho"/>
            <WarehouseForm/>
        </DefaultLayout>
    );
};

export default CreateWarehousePage;