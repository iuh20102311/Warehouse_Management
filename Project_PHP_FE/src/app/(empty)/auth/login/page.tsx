'use client'
import React, {useState} from "react";
import Link from "next/link";
import Image from "next/image";
import {AuthBg, Clock, Email, Google,} from "@/components/Icons";
import {useRouter} from "next/navigation";
import {toast} from "react-toastify";
import Cookies from "js-cookie";
import {Tokens} from "@/models/Tokens";

interface LoginResponse {
    accessToken: string;
    refreshToken: string;
}

const Login: React.FC = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    const [emailError, setEmailError] = useState(false);

    const  passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()-_=+{};:',<.>/?])(?=.*\d).{8,32}$/;
    const [passwordError, setPasswordError]=useState(false);

    const onLogin = async () : Promise<LoginResponse | void> => {
        if (!emailRegex.test(email)) {
            setEmailError(true);
        }
        else {
            setEmailError(false);
        }

        if (!passwordRegex.test(password)) {
            setPasswordError(true);
        }
        else {
            setPasswordError(false);
        }
        const response = await fetch('http://localhost:8000/api/v1/auth/login', {
            method: 'POST',
            headers: {
                'Accept': 'application/json'
            },
            body: JSON.stringify({email: email, password: password})
        });
        if (response.ok) {
            toast.success('Đăng nhập thành công');
            const data : Tokens = await response.json();
            Cookies.set('token', data.accessToken);
            router.push('/');
        } else {
            toast.error('Đã có lỗi xảy ra. Thử lại sau');
        }
    }

    return (
        <div
            className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark h-screen">
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
                        {/*<span className="mb-1.5 block font-medium">Start for free</span>*/}
                        <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
                            Đăng nhập
                        </h2>

                        <div className="mb-4">
                            <label className="mb-2.5 block font-medium text-black dark:text-white">
                                Email
                            </label>
                            <div className="relative">
                                <input
                                    type="email"
                                    placeholder="Nhập email"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value)
                                    }}
                                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                />
                                <span className="absolute right-4 top-4"><Email/></span>
                            </div>

                            {emailError && <div><span className="text-red text-sm">Email không hợp lệ</span></div>}
                        </div>

                        <div className="mb-6">
                            <label className="mb-2.5 block font-medium text-black dark:text-white">
                                Mật khẩu
                            </label>
                            <div className="relative">
                                <input
                                    type="password"
                                    placeholder="Nhập mật khẩu"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value)
                                    }}
                                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                />

                                <span className="absolute right-4 top-4"><Clock/></span>

                                {passwordError && <div><span className="text-red text-sm">Mật khẩu có ít nhất 8 ký tự, tối thiểu 1 ký tự viết hoa, ký tự đặc biệt, ít nhất 1 chữ số</span></div>}
                            </div>
                        </div>

                        <div className="mb-5">
                            <input
                                type="button"
                                value="Đăng nhập"
                                onClick={onLogin}
                                className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
                            />
                        </div>

                        <button
                            className="flex w-full items-center justify-center gap-3.5 rounded-lg border border-stroke bg-gray p-4 hover:bg-opacity-50 dark:border-strokedark dark:bg-meta-4 dark:hover:bg-opacity-50">
                            <span><Google/></span>
                            Đăng nhập với Google
                        </button>

                        <div className="mt-6 text-center">
                            <p>
                                Bạn chưa có tài khoản?{" "}
                                <Link href="/auth/register" className="text-primary">
                                    Đăng ký
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
        ;
};

export default Login;