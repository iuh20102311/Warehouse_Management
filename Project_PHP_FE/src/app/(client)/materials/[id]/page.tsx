'use client'
import React, {useEffect, useState} from 'react';
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import {MaterialForm, OrderForm, ProductForm} from "@/components/Forms";
import {Material} from "@/models/Model";

const EditMaterialPage = ({params} : {params: {id: string}}) => {
    const [material, setMaterial] = useState<Material>();
    const getData = async () => {
        await fetch(`http://localhost:8000/api/v1/materials/${params.id}`)
            .then(res => {
                return res.json()
            })
            .then(data => {
                setMaterial(data);
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
            <MaterialForm material={material}/>
        </DefaultLayout>
    );
};

export default EditMaterialPage;