//React Imports
import { createContext, useEffect, useReducer } from "react";

//auth object
import { auth } from "../firebase/config";

export const AuthContext = createContext();

const authReducer = (state, action) => {
    switch(action.type) {
       case 'AUTH_IS_READY':
           return {...state, user: action.payload, authIsReady: true}
       case 'LOGIN':
           return {...state, user: action.payload}
       case 'LOGOUT':
           return {...state, user: null}
       default:
           return state;
    }
}

export const AuthContextProvider = ({children}) => {

    const [state, dispatch] = useReducer(authReducer, {user: null, authIsReady: false});

    useEffect(() => {
        const unsub = auth.onAuthStateChanged((user) => {
            console.log("User Details ->", user);
            dispatch({type: 'AUTH_IS_READY', payload: user})
            unsub();
        })
    }, [])

    console.log("authContext State is :", state);

    return <AuthContext.Provider value={{...state, dispatch}}>
                {children}
           </AuthContext.Provider>
}


