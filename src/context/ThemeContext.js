import { createContext, useEffect, useState } from "react";

export const ThemeContext = createContext();

export const ThemeContextProvider = ({children}) => {

    const [mode, setMode] = useState('light');

    const changeMode = () => {
        setMode(prevMode => {
            return prevMode === 'light' ? 'dark' : 'light';
        })
    }

    useEffect(() => {
       if(localStorage.getItem('mode')){
            setMode(localStorage.getItem('mode'));
       }
    },[])

    useEffect(() => {
        if(mode === 'dark'){
            document.body.classList.add('dark');
        } else {
            document.body.classList.remove('dark');
        }
        localStorage.setItem('mode', mode);
    },[mode])

    return (
    <ThemeContext.Provider value={{mode, changeMode}}>
        {children}
    </ThemeContext.Provider>
    )
}