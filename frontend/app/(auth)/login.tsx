import { useRouter } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient';
import { Button, KeyboardAvoidingView, Pressable, Platform, Text, TextInput, View,Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';


const register = () => {

  const [ loginData , setLoginData] = useState({email: "", password: ""});
  const[error, setError] = useState({});
  const {login} = useAuth();

const handleLogin =  async ()=> {
  const err:any= []
   if(!loginData.email){
      err.email = 'Email is required'
   }
   if(!loginData.password){
      err.password = 'Password is required'
   }
   setError({error: err})
   const res = await fetch('https://quickrecipe.onrender.com/api/auth/login',{
     method:'POST',
     headers:{
      "Content-Type" : "application/json"
     },
     body: JSON.stringify({email : loginData.email , password: loginData.password }) 
      })
      
      const userData: any= await res.json();
      if(res){
     login(userData.user , userData.token);
     router.push('/')
     
   }

}

 const handleInput = (fieldName : string , value: string) =>{
          setLoginData((prevState) =>({
            ...prevState,
            [fieldName] : value
          }))
 }


  const router = useRouter();
  return (
  
    <SafeAreaView className='flex-1 '>
      <LinearGradient 
      colors={['#2b0a0a', '#000000']} 
      style={{ flex: 1 }}>
        <KeyboardAvoidingView
        style={{ flex: 1 , justifyContent: 'center'}}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View className='justify-center items-center px-6 space-y-4'>
          <View className='flex-row  justify-center items-center  gap-2 mb-8'>
            <Image source={require('../../assets/LoginImages/hat_7270962.png')} style={{ width:20 , height:20 }}/>
            <Text className='text-white text-4xl font-bold '>QuickRecipe</Text>
          </View>
           <Text className='text-white text-xl text-center mb-6 '> Sign In Your Account</Text>
        <View className='w-[100%] space-y-4'>
        
          <Text className='text-white mb-2 ml-2'>Email</Text>
         <TextInput value={loginData.email} className='bg-black/40  text-white px-4 py-3 rounded-full mb-2  border border-gray-700'  placeholder='Enter your email' placeholderTextColor="#888" keyboardType="email-address" onChangeText={(text)=> handleInput('email' , text)}/>
         {
          error.email && <Text className='text-red-500 text-sm'>{error.email}</Text>
         }
         
          <Text className='text-white mb-2 ml-2'>Password</Text>
         <TextInput value={loginData.password} secureTextEntry className='bg-black/40  text-white px-4 py-3 rounded-full  border border-gray-700 mb-2'  placeholder='Enter your Password' placeholderTextColor="#888" onChangeText={(text)=> handleInput('password' , text)}/>
         {
          error.password && <Text className='text-red-500 text-sm'>{error.password}</Text>
         }
     
        <Pressable className="mt-4 rounded-full overflow-hidden " onPress={()=> handleLogin()}>
              <LinearGradient
                colors={["#ff7a00", "#ff3d00"]}
                className="py-3 rounded-full items-center "
              >
                <Text className="text-white font-semibold text-lg">
                  Login
                </Text>
              </LinearGradient>
            </Pressable>


        
        </View>
      
        </View>

        <View className='flex-row items-center justify-center mt-8 mb-2 gap-1'>
          <Text className='text-white  ml-2'>Dont't have account?</Text>
          <Pressable onPress={() => router.push('/(auth)/register')}>
            <Text className='text-orange-600'>SignUp</Text>
          </Pressable>
        </View>
        </KeyboardAvoidingView>
        </LinearGradient>
    </SafeAreaView>
  
  )
}

export default register
