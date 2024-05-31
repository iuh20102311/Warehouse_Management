'use client'
import React, {useEffect, useState} from 'react';
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import {CustomerForm} from "@/components/Forms";
import {Customer} from "@/models/Model";

const EditCustomerPage = ({params} : {params: {id: string}}) => {
    const [customer, setCustomer] = useState<Customer>();
    const getData = async () => {
        await fetch(`http://localhost:8000/api/v1/customers/${params.id}`)
            .then(res => {
                return res.json()
            })
            .then(data => {
                setCustomer(data);
            })
            .catch(err => {
                console.log(err);
            })
    }


    useEffect(() => {
        getData();
    }, []);
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Cập nhật khách hàng"/>
            <CustomerForm customer={customer}/>
        </DefaultLayout>
    );
};

export default EditCustomerPage;