'use client'
import React, {useEffect, useState} from 'react';
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import {ProductForm} from "@/components/Forms";
import {Product} from "@/models/Model";

const EditProductPage = ({params} : {params: {id: string}}) => {
    const [product, setProduct] = useState<Product>();
    const getData = async () => {
        await fetch(`http://localhost:8000/api/v1/products/${params.id}`)
            .then(res => {
                return res.json()
            })
            .then(data => {
                setProduct(data);
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
            <Breadcrumb pageName="Cập nhật sản phẩm"/>
            <ProductForm product={product}/>
        </DefaultLayout>
    );
};

export default EditProductPage;