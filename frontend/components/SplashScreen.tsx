import React, { useEffect } from "react";
import { ActivityIndicator, Text, View } from "react-native";

export const SplashScreen = ({ onFinish }: any) => {
  useEffect(() => {
    const timeout = setTimeout(() => {
      onFinish();
    }, 1500);

    return () => clearTimeout(timeout);
  }, [onFinish]);

  return (
    <View className="flex-1 bg-[#2b0a0a] justify-center items-center px-6">
      <Text className="text-4xl font-bold text-white text-center">
        Quick recipe
      </Text>
      <ActivityIndicator
        size="large"
        color="#ffffff"
        style={{ marginTop: 24 }}
      />
    </View>
  );
};

// export default SplashScreen
