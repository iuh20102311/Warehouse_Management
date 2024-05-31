import {useContext} from "react";
import {AuthContext} from "@/context/AuthContext";

const useAuth = () => {
    const {profile, logout} = useContext(AuthContext);
    return {profile, logout};
};

export default useAuth;