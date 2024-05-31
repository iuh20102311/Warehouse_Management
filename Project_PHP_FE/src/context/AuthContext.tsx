import React, {createContext, useEffect, useState} from "react";
import Cookies from "js-cookie";
import {getData} from "@/services/APIService";
import {useRouter} from "next/navigation";

type  AuthContextType = {
    token: string;
    profile: Profile;
    loading: boolean;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

interface Props {
    children: React.ReactNode;
}

const AuthProvider = ({children} : Props) => {
    const [token, setToken] = useState<string>("");
    const [profile, setProfile] = useState<Profile>({} as Profile);
    const [loading, setLoading] = useState<boolean>(true);
    const router = useRouter();

    useEffect(() => {
        const tokenInCookie = Cookies.get("token");
        if (tokenInCookie && tokenInCookie !== "") {
            setToken(tokenInCookie);
        } else {
            setLoading(false);
        }
    }, []);

    const getProfile = async () => {
        const data : Profile = await getData("http://localhost:8000/api/v1/auth/profile", token);
        setProfile(data);
        setLoading(false);
    }

    useEffect(() => {
        if (token && token !== "") {
            getProfile();
        }
    }, [token]);


    const logout = () => {
        Cookies.remove('token');
        setToken("");
        setProfile({} as Profile);
        router.push('/auth/login');
    }

    return (
        <AuthContext.Provider value={{token, profile, loading, logout}}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;
export {AuthContext}