import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";

export const useAuthContext = () => {
    
    const context = useContext(AuthContext);

    if(!context) {
        throw new Error("AuthContext can only be accessed inside an AuthContext Provider!")
    }

    return context;
   
}
