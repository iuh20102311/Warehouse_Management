import React from 'react';
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import {EmployeeForm} from "@/components/Forms";

const CreateEmployeePage = () => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Thêm nhân viên"/>
            <EmployeeForm/>
        </DefaultLayout>
    );
};

export default CreateEmployeePage;