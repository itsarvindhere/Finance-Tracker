//React Imports
import { useState, useEffect} from "react";

//Firebase Auth Object
import { auth } from "../firebase/config"

//Context
import {useAuthContext} from './useAuthContext';

export const useSignUp = () => {

    const [isUnmounted, setIsUnmounted] = useState(false);
    const [error, setError] =  useState(null);
    const [isPending, setIsPending] =  useState(false);

      
    //context
    const {dispatch} = useAuthContext();
    const signUp = async (email, password, displayName) => {
        setIsUnmounted(false);
        setError(null);
        setIsPending(true);
        try {
            //Sign up the user
            const response = await auth.createUserWithEmailAndPassword(email, password);

            if(!response){
                throw new Error('We Could not complete your Sign Up. Please Try Again after some time!');
            }

            //Add user's displayname
            await response.user.updateProfile({displayName});

            //Dispatch Login action
            dispatch({type: 'LOGIN', payload: response.user});

            if(!isUnmounted) {
                setIsPending(false);
                setError(null);
            }
            

        } catch(error) {
            //if sign up fails with some error then this code runs
            console.log(error.message);
            if(!isUnmounted) {
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

    return {signUp, error, isPending};
    
}
