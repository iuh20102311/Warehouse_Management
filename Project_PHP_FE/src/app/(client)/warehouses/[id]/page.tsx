'use client'
import React, {useEffect, useState} from 'react';
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import {WarehouseForm} from "@/components/Forms";
import {Warehouse} from "@/models/Model";

const EditWarehousePage = ({params} : {params: {id: string}}) => {
    const [warehouse, setWarehouse] = useState<Warehouse>();
    const getData = async () => {
        await fetch(`http://localhost:8000/api/v1/warehouses/${params.id}`)
            .then(res => {
                return res.json()
            })
            .then(data => {
                setWarehouse(data);
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
            <Breadcrumb pageName="Cập nhật nhà kho"/>
            <WarehouseForm warehouse={warehouse}/>
        </DefaultLayout>
    );
};

export default EditWarehousePage;