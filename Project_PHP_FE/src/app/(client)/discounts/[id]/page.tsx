'use client'
import React, {useEffect, useState} from 'react';
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import {DiscountForm} from "@/components/Forms";
import {Discount} from "@/models/Model";

const EditDiscountPage = ({params} : {params: {id: string}}) => {
    const [discount, setDiscount] = useState<Discount>();
    const getData = async () => {
        await fetch(`http://localhost:8000/api/v1/discounts/${params.id}`)
            .then(res => {
                return res.json()
            })
            .then(data => {
                console.log(data)
                setDiscount(data);
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
            <Breadcrumb pageName="Cập nhật nguyên vật liệu"/>
            <DiscountForm discount={discount}/>
        </DefaultLayout>
    );
};

export default EditDiscountPage;