import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

export const useThemeContext = () => {
    
    const context = useContext(ThemeContext);

    if(!context) {
        throw new Error("ThemeContext can only be accessed inside an ThemeContext Provider!")
    }
    
    return context;
   
}
