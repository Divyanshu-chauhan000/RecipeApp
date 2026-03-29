import { useAuth } from "@/context/AuthContext";
import { Redirect, Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";

const _tabslayout = () => {
  const { user } = useAuth();

  if (!user) {
    return <Redirect href={"/"} />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#050505",
          borderTopColor: "#050505",
        },
        tabBarActiveTintColor: "#fff",
        tabBarInactiveTintColor: "#b0b0b0",
      }}
    >
      <Tabs.Screen
        name="top-recipe"
        options={{
          title: "Top Recipes",
          headerShown: false,
          tabBarIcon: ({ color, size }) => {
            return <Ionicons name="star" color={color} size={size} />;
          },
        }}
      />

      <Tabs.Screen
        name="my-recipe"
        options={{
          title: "My Recipes",
          headerShown: false,
          tabBarIcon: ({ color, size }) => {
            return <Ionicons name="book" color={color} size={size} />;
          },
        }}
      />

      <Tabs.Screen
        name="user-setting"
        options={{
          title: "Setting",
          headerShown: false,
          tabBarIcon: ({ color, size }) => {
            return <Ionicons name="settings" color={color} size={size} />;
          },
        }}
      />
    </Tabs>
  );
};

export default _tabslayout;
