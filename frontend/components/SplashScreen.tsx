import React, { useEffect, useRef } from 'react'
import { Animated, Image, Text, View } from 'react-native'

export const SplashScreen = ({onFinish} : any) => {
  const translateX = useRef(new Animated.Value(-200)).current;
   const textAnim = useRef(new Animated.Value(200)).current;
  const opacity = useRef(new Animated.Value(0)).current;

 useEffect(() =>{
  Animated.parallel([
    Animated.timing(translateX,{
      toValue : 0,
      duration: 1000,
      useNativeDriver: true
    }),
    Animated.timing(opacity, {
      toValue : 1,
      duration : 1000,
      useNativeDriver: true
    }),
      Animated.timing(textAnim,{
      toValue : 0,
      duration: 1000,
      useNativeDriver: true
    }),
  ]).start(() =>{
  setTimeout(() => {
        onFinish();
      }, 500);
  })
 }, [])


  return (
  <View className='flex-1 bg-[#2b0a0a] justify-center items-center'>

      <View className="flex-row items-center">

        {/* Image */}
        <Animated.Image
          source={require("../assets/LoginImages/hat_7270962.png")}
          style={{
            width: 50,
            height: 50,
            marginRight: 10,
            transform: [{ translateX: translateX }],
            opacity
          }}
        />

        {/* Text */}
        <Animated.Text
          style={{
            fontSize: 28,
            fontWeight: 'bold',
            color: 'white',
            transform: [{ translateX: textAnim }],
            opacity
          }}
        >
          QuickRecipe
        </Animated.Text>

      </View>

      {/* Bottom loader bar */}
      <Animated.View
        style={{ opacity }}
        className="mt-4 w-20 h-2 bg-white/20 rounded-full"
      />

    </View>
  )
}

// export default SplashScreen
