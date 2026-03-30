import React, { useEffect, useRef } from "react";
import { Animated, Image, Text, View } from "react-native";

export const SplashScreen = ({ onFinish }: any) => {
  const translateX = useRef(new Animated.Value(-200)).current;
  const textAnim = useRef(new Animated.Value(200)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateX, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(textAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setTimeout(() => {
        onFinish();
      }, 500);
    });
  }, []);

  console.log(
    Image.resolveAssetSource(require("../assets/LoginImages/hat2.png")),
  );

  return (
    <View className="flex-1 bg-[#2b0a0a] justify-center items-center">
      <View
        className="items-center justify-center"
        style={{ overflow: "hidden" }}
      >
        {/* Image */}
        <Animated.Image
          source={require("../assets/LoginImages/hat2.png")}
          style={{
            width: 140,
            height: 140,
            marginBottom: 24,
            resizeMode: "contain",
            transform: [{ translateX: translateX }],
            opacity,
          }}
        />

        {/* Text */}
        <Animated.Text
          style={{
            fontSize: 28,
            fontWeight: "bold",
            color: "white",
            textAlign: "center",
            transform: [{ translateX: textAnim }],
            opacity,
          }}
        >
          QuickRecipe
        </Animated.Text>
      </View>

      {/* Bottom loader bar */}
      <Animated.View
        style={{ opacity }}
        className="mt-8 w-24 h-2 bg-white/30 rounded-full"
      />
    </View>
  );
};

// export default SplashScreen
