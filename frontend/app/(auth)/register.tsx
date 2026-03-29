import { useRouter } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient';
import { Button, KeyboardAvoidingView, Pressable, Platform, Text, TextInput, View,Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useState } from 'react';
import Toast from 'react-native-toast-message';

const register = () => {
  const [register , setRegister] = useState({fullName : "" , email: "", password: ""});
  const [loading , setLoading] = useState(false);

  const inputHandler = (fieldName: string , value : string) =>{
           setRegister((prevState) =>({
            ...prevState,
            [fieldName] : value
           }))
  }

  const handleRegister = async ()=>{
      const {fullName , email, password} = register
    const res = await fetch('http://10.0.2.2:5001/api/auth/register',{
      method: 'POST',
      headers:{
        "Content-Type" : "application/json"
      },
      body : JSON.stringify({
        fullName , email, password
      })
    })
    if(res){
      const resData = await res.json();
      Toast.show({
      type: 'success',
      text1: 'success',
      text2: 'Please login to continue'
    });
    // setLoading(false)
      router.push('/login');
    }
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
           <Text className='text-white text-xl text-center mb-6 '>Create Your Account </Text>
        <View className='w-[100%] space-y-4'>
          <Text className='text-white mb-2 ml-2'>Full Name</Text>
         <TextInput value={register.fullName} onChangeText={(text) => inputHandler('fullName' , text)} className='bg-black/40  text-white px-4 py-3 mb-2 rounded-full  border border-gray-700'  placeholder='Enter your Name' placeholderTextColor="#888"/>
          <Text className='text-white mb-2 ml-2'>Email</Text>
         <TextInput value={register.email} onChangeText={(text) => inputHandler('email' , text)} className='bg-black/40  text-white px-4 py-3 rounded-full mb-2  border border-gray-700'  placeholder='Enter your email' placeholderTextColor="#888" keyboardType="email-address"/>
         
          <Text className='text-white mb-2 ml-2'>Password</Text>
         <TextInput value={register.password} onChangeText={(text) => inputHandler('password' , text)} secureTextEntry className='bg-black/40  text-white px-4 py-3 rounded-full  border border-gray-700 mb-2'  placeholder='Enter your Password' placeholderTextColor="#888"/>
     
        <Pressable className="mt-4 rounded-full overflow-hidden " onPress={()=> handleRegister()}>
              <LinearGradient
                colors={["#ff7a00", "#ff3d00"]}
                className="py-3 rounded-full items-center "
              >
                <Text className="text-white font-semibold text-lg">
                  {loading ? "Signing Up..." : "Signup"}
                </Text>
              </LinearGradient>
            </Pressable>


        
        </View>


        <View className='flex-row items-center gap-4 mt-8'>
          <Text className='text-white'>Or continue with</Text>
        </View>

        <View className='flex-row justify-center gap-4 mt-4'>
          <Pressable className="border border-gray-600 p-3 rounded-full">
             <Image
             source={require('../../assets/LoginImages/logo_16509564.png')}
            style={{ width: 30, height: 30 }}/>
             
            </Pressable>

            <Pressable className="bg-gray-800 border border-gray p-3 rounded-full">
               <Image
             source={require('../../assets/LoginImages/social_14449880.png')}
            style={{ width: 30, height: 30 }}/>
              
            </Pressable>

            <Pressable className="bg-gray-800 p-3 border border-gray flex justify-center  rounded-full">
              <Image
             source={require('../../assets/LoginImages/twitter_5968958.png')}
            style={{ width: 30, height: 20 }}/>
              
            </Pressable>
        </View>
        </View>

        <View className='flex-row items-center justify-center mt-8 mb-2 gap-1'>
          <Text className='text-white  ml-2 '>Already have account?</Text>
          <Pressable onPress={() => router.push('/login')}>
            <Text className='text-orange-600'>Login</Text>
          </Pressable>
        </View>
        </KeyboardAvoidingView>
        </LinearGradient>
    </SafeAreaView>
  
  )
}

export default register
