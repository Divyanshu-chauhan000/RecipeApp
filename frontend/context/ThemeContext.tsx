import { createContext, useContext, useEffect, useState } from "react"



type ThemeContextType = {
  currentTheme : string;
  toggleTheme : (newTheme : string) =>void;
}


const ThemeContext = createContext<ThemeContextType>({
    currentTheme : 'light',
    toggleTheme:()=>{}
});

export const ThemeProvider :  React.FC<{children : React.ReactNode}> = ({children})=>{
   const [theme , setTheme] = useState<string>('light');
  const toggleTheme = (newTheme: string) =>{
    setTheme(newTheme);
  }
  
  return (
    <ThemeContext.Provider value={{currentTheme : theme, toggleTheme }}>
           {children}
    </ThemeContext.Provider>
  )
}
export const useTheme = () => useContext(ThemeContext)