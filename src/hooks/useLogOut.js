//React Imports
import { useState, useEffect } from "react"

//Firebase Auth Object

import { auth } from "../firebase/config"

//Context Hook
import { useAuthContext } from "./useAuthContext"

export const useLogOut = () => {
    const [isUnmounted, setIsUnmounted] = useState(false);
    const [error, setError] = useState(null);
    const [isPending, setIsPending] = useState(false);

    const {dispatch} = useAuthContext();

    const logout = async () => {
        setError(null);
        setIsPending(true);

        //Logout the user
        try {
            await auth.signOut();

            //Dispatch Logout action (No Payload means all we want is the user to be null in our AuthContext)
            dispatch({type: 'LOGOUT'});

            //Update states
            if(!isUnmounted){
                setIsPending(false);
                setError(null);
            }
           
        } catch(error){
            if(!isUnmounted){
            console.log(error.message);
            setError(error.message);
            setIsPending(false);
            }
    }
}

    //For Cleanup we do this
    useEffect(() => {
        return () => {
            console.log("Unmounted");
            setIsUnmounted(true);
        }
    }, [])

    return {logout, error, isPending};

}
