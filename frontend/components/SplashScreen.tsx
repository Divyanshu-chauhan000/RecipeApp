import React, { useEffect, useRef } from 'react'
import { Animated, Image, Text, View } from 'react-native'

export const SplashScreen = ({onFinish} : any) => {
  const translateX = useRef(new Animated.Value(-200)).current;
  const opacity = useRef(new Animated.Value(0)).current;

 useEffect(() =>{
  Animated.parallel([
    Animated.timing(translateX,{
      toValue : 0,
      duration: 1200,
      useNativeDriver: true
    }),
    Animated.timing(opacity, {
      toValue : 1,
      duration : 1200,
      useNativeDriver: true
    }),
  ]).start(() =>{
  onFinish ();
  })
 }, [])


  return (
  <View className='flex-1 bg-[#2b0a0a] justify-center items-center'>

    <Animated.View style={{transform : [{translateX}] , opacity}}   className="flex-row items-center">
      <Image source={require("../assets/LoginImages/hat_7270962.png")} className='w-14 h-14 mr-3 ' />
    <Text className='text-white text-3xl font-bold'>QuickRecipe</Text>
    </Animated.View>
    <Animated.View
        style={{ opacity }}
        className="mt-3 w-16 h-4 bg-white/20 rounded-full"
      />
  </View>
  )
}

// export default SplashScreen
