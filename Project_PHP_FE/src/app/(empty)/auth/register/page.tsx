'use client'
import React, {useState} from "react";
import Link from "next/link";
import Image from "next/image";

import {Metadata} from "next";
import {AuthBg, Clock, Email, Google, Person} from "@/components/Icons";
import computeSourceMap from "sucrase/dist/types/computeSourceMap";

const Register: React.FC = () => {

    const [data, setData] = useState({
        name: '',
        email: '',
        password: '',
        rePassword: ''
    })

    const [error, setError] = useState({
        name: false,
        email: false,
        password: false,
        rePassword: false
    })

    const [regex, setRegex] = useState({
        name: /^[A-ZÀÁẢẠÃĂẰẮẲẶẴÂẦẤẨẬẪĐEÈÉẺẸẼÊỀẾỂỆỄIÌÍỈỊĨOÒÓỎỌÕÔỒỐỔỘỖƠỜỚỞỢỠUÙÚỦỤŨƯỪỨỬỰỮYỲÝỶỴỸa-zàáảạãăằắẳặẵâầấẩậẫđeèéẻẹẽêềếểệễiìíỉịĩoòóỏọõôồốổộỗơờớởợỡuùúủụũưừứửựữyỳýỷỵỹ?][A-ZÀÁẢẠÃĂẰẮẲẶẴÂẦẤẨẬẪĐEÈÉẺẸẼÊỀẾỂỆỄIÌÍỈỊĨOÒÓỎỌÕÔỒỐỔỘỖƠỜỚỞỢỠUÙÚỦỤŨƯỪỨỬỰỮYỲÝỶỴỸa-zàáảạãăằắẳặẵâầấẩậẫđeèéẻẹẽêềếểệễiìíỉịĩoòóỏọõôồốổộỗơờớởợỡuùúủụũưừứửựữyỳýỷỵỹ?\s]*$/,
        email: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
        password: /^(?=.*[A-Z])(?=.*[!@#$%^&*()-_=+{};:',<.>/?])(?=.*\d).{8,32}$/,
    })

    const onRegister = ()=>{
        if (!regex.name.test(data.name)) {
            setError(prevState => ({...prevState, name: true}));
        }
        else {
            setError(prevState => ({...prevState, name: false}));
        }

        if (!regex.email.test(data.email)) {
            setError(prevState => ({...prevState, email: true}));
        }
        else {
            setError(prevState => ({...prevState, email: false}));
        }

        if (!regex.password.test(data.password)) {
            setError(prevState => ({...prevState, password: true}));
        }
        else {
            setError(prevState => ({...prevState, password: false}));
        }

        if (data.password !== data.rePassword){
            setError(prevState => ({...prevState, rePassword: true}));
        }
        else{
            setError(prevState => ({...prevState, rePassword: false}));
        }
    }


    return (
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="flex flex-wrap items-center">
                <div className="hidden w-full xl:block xl:w-1/2">
                    <div className="px-26 py-17.5 text-center">
                        <Link className="mb-5.5 inline-block" href="/">
                            <Image
                                className="hidden dark:block"
                                src={"/images/logo/logo.svg"}
                                alt="Logo"
                                width={176}
                                height={32}
                            />
                            <Image
                                className="dark:hidden"
                                src={"/images/logo/logo-dark.svg"}
                                alt="Logo"
                                width={176}
                                height={32}
                            />
                        </Link>
                        <p className="2xl:px-20">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit
                            suspendisse.
                        </p>

                        <span className="mt-15 inline-block"><AuthBg/></span>
                    </div>
                </div>

                <div className="w-full border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2">
                    <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
                        <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
                            Đăng ký
                        </h2>

                        <div className="mb-4">
                            <label className="mb-2.5 block font-medium text-black dark:text-white">
                                Tên
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Nhập tên"
                                    value={data.name}
                                    onChange={(e) => {
                                        setData({...data, name: e.target.value})
                                    }}
                                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                />

                                <span className="absolute right-4 top-4"><Person/></span>
                                {error.name &&
                                    <div><span className="text-red text-sm">Tên chỉ gồm chữ cái và khoảng trắng</span>
                                    </div>}

                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="mb-2.5 block font-medium text-black dark:text-white">
                                Email
                            </label>
                            <div className="relative">
                                <input
                                    type="email"
                                    placeholder="Nhập email"
                                    value={data.email}
                                    onChange={(e) => {
                                        setData({...data, email: e.target.value})
                                    }}
                                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                />

                                <span className="absolute right-4 top-4"><Email/></span>

                                {error.email && <div><span className="text-red text-sm">Email không hợp lệ</span></div>}
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="mb-2.5 block font-medium text-black dark:text-white">
                                Mật khẩu
                            </label>
                            <div className="relative">
                                <input
                                    type="password"
                                    placeholder="Nhập mật khẩu"
                                    value={data.password}
                                    onChange={(e) => {
                                        setData({...data, password: e.target.value})
                                    }}
                                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                />

                                <span className="absolute right-4 top-4"><Clock/></span>
                                {error.password &&
                                    <div><span className="text-red text-sm">Mật khẩu có ít nhất 8 ký tự, tối thiểu 1 ký tự viết hoa, ký tự đặc biệt, ít nhất 1 chữ số</span>
                                    </div>}

                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="mb-2.5 block font-medium text-black dark:text-white">
                                Nhập lại mật khẩu
                            </label>
                            <div className="relative">
                                <input
                                    type="password"
                                    placeholder="Nhập lại mật khẩu"
                                    value={data.rePassword}
                                    onChange={(e) => {
                                        setData({...data, rePassword: e.target.value})
                                    }}
                                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                />
                                <span className="absolute right-4 top-4"><Clock/></span>
                                {error.rePassword &&
                                    <div><span className="text-red text-sm">Mật khẩu không trùng khớp</span></div>}

                            </div>
                        </div>

                        <div className="mb-5">
                            <input
                                type="button"
                                value="Tạo tài khoản"
                                onClick={onRegister}
                                className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
                            />
                        </div>

                        <button
                            className="flex w-full items-center justify-center gap-3.5 rounded-lg border border-stroke bg-gray p-4 hover:bg-opacity-50 dark:border-strokedark dark:bg-meta-4 dark:hover:bg-opacity-50">
                            <span><Google/></span>

                            Đăng ký với Google
                        </button>

                        <div className="mt-6 text-center">
                            <p>
                                Bạn đã có tài khoản?{" "}
                                <Link href="/auth/login" className="text-primary">
                                    Đăng nhập
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
