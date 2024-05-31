'use client'
import React, {useEffect, useState} from 'react';
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import {ProviderForm} from "@/components/Forms";
import {Provider} from "@/models/Model";

const EditProviderPage = ({params} : {params: {id: string}}) => {
    const [provider, setProvider] = useState<Provider>();
    const getData = async () => {
        await fetch(`http://localhost:8000/api/v1/providers/${params.id}`)
            .then(res => {
                return res.json()
            })
            .then(data => {
                setProvider(data);
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
            <Breadcrumb pageName="Cập nhật nhà cung cấp"/>
            <ProviderForm provider={provider}/>
        </DefaultLayout>
    );
};

export default EditProviderPage;