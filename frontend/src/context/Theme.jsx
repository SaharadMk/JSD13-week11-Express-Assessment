import { createContext } from "react";
import { useState } from "react";

export const ThemeContext = createContext();

const ThemeProvider = ({children}) => {
const [theme, setTheme] = useState(false);
const lightTheme = "bg-white text-black text-2xl";
const darkTheme = "bg-black text-white text-2xl";
const value = { lightTheme, darkTheme, theme, setTheme };
    return (
        <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
    );
}
export default ThemeProvider;