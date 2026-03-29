import { AuthProvider, useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { View } from "react-native";
import { ThemeProvider } from "@/context/ThemeContext";
// import * as SplashScreen from "expo-splash-screen";
import { Stack } from "expo-router";
import { useFonts, Poppins_700Bold, Poppins_300Light } from "@expo-google-fonts/poppins";
// import { useEffect } from "react";
import { SplashScreen } from '../components/SplashScreen'


function RootNavigator() {
  const { token } = useAuth();

  const [fontsLoaded, fontError] = useFonts({
    Poppins_700Bold,
    Poppins_300Light,
  });

  
  // if (showSplash) {
    //   return <SplashScreen onFinish={() => setShowSplash(false)} />;
  // }

  if (!fontsLoaded && !fontError) {
    return null;
  }
  
  return (
    <Stack screenOptions={{ headerShown: false,contentStyle: { backgroundColor: "#2b0a0a" } }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(auth)" />

      {token ? (
        <>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="create-recipe" options={{ presentation: "modal" }} />
          <Stack.Screen name="profile-details" />
          <Stack.Screen name="about-app" />
          <Stack.Screen name="help-faq" />
          <Stack.Screen name="profile-pic" />
        </>
      ) : null}

      <Stack.Screen name="(app)" />
    </Stack>
  );
}

export default function RootLayout() {
  const [showSplash, setShowSplash] = useState(true);
  return (
 <View style={{ flex: 1, backgroundColor: "#2b0a0a" }}>
      {showSplash ? (
        <SplashScreen onFinish={() => setShowSplash(false)} />
      ) : (
        <ThemeProvider>
          <AuthProvider>
            <RootNavigator />
          </AuthProvider>
        </ThemeProvider>
      )}
    </View>
  );
}