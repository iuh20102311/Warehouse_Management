'use client'
import React, {useEffect, useState} from 'react';
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import {OrderForm, ProductForm} from "@/components/Forms";
import {Order} from "@/models/Model";

const EditOrderPage = ({params} : {params: {id: string}}) => {
    const [order, setOrder] = useState<Order>();
    const getData = async () => {
        await fetch(`http://localhost:8000/api/v1/orders/${params.id}`)
            .then(res => {
                return res.json()
            })
            .then(data => {
                setOrder(data);
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
            <Breadcrumb pageName="Cập nhật đơn hàng"/>
            <OrderForm order={order}/>
        </DefaultLayout>
    );
};

export default EditOrderPage;