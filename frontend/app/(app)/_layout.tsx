import { useAuth } from "@/context/AuthContext"
import { Redirect, Slot } from "expo-router"

const AppLayout = () => {

  const { token , isLoading}  = useAuth();
  if(isLoading) return null;

  if(!token) return <Redirect href={'/login'}/>
  return <Slot/>


  
}

export default AppLayout
