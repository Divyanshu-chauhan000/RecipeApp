import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import "../global.css";
import RecipeCard from "@/components/RecipeCard";
import { ScrollView } from "react-native";
import { Redirect, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "@/context/AuthContext";
import {
  useFonts,
  Poppins_700Bold_Italic,
  Poppins_300Light,
} from "@expo-google-fonts/poppins";

type RecipeCardProp = {
  _id: string;
  title: string;
  image: string;
  ingredients: string[];
  instructions: string;
};

export default function Index() {
  const [fontLoad] = useFonts({
    Poppins_700Bold_Italic,
    Poppins_300Light,
  });

  const [recipes, setRecipes] = useState([]);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    getAllRecipes();
  }, []);

  const getAllRecipes = async () => {
    const res = await fetch("http://10.0.2.2:5001/api/recipes");
    const data = await res.json();
    setRecipes(data);
    //  console.log(data)
  };

  if (user) {
    return <Redirect href={"/top-recipe"} />;
  }
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient colors={["#2b0a0a", "#000000"]} style={{ flex: 1 }}>
        <Toast />
        <View className="flex-row justify-between items-center px-6 py-3">
          <Text className="text-2xl font-bold  text-white">Recipes</Text>

          <Pressable onPress={() => router.push("/(auth)/login")}>
            <Text className="text-xl text-orange-500">Login</Text>
          </Pressable>
        </View>
        <ScrollView>
          {recipes.map((recipes: RecipeCardProp) => (
            <View key={recipes._id}>
              <RecipeCard
                title={recipes.title}
                ingredients={recipes.ingredients}
                imageURI={recipes.image}
                instructions={recipes.instructions}
              />
            </View>
          ))}
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}
