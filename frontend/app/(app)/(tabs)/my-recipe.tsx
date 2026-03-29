import TopBar from "@/components/TopBar";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { GetRecipe } from "@/services/recipe.service";
import RecipeCard from "@/components/RecipeCard";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { ScrollView } from "react-native";
import Toast from "react-native-toast-message";

type RecipeCardProp = {
  _id: string;
  title: string;
  imageUrl: string;
  ingredients: string[];
  instructions: string;
  averageRating: number;
  createdBy: {
    _id: string;
    fullName: string;
    profilepic: string;
  };
};

const myrecipe = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    getMyRecipe();
  }, [user]);

  const getMyRecipe = async () => {
    try {
      setLoading(true);
      setError(null);
      const res: any = await GetRecipe();
      console.log("Recipes fetched:", res.data);
      setRecipes(res.data);
    } catch (err: any) {
      console.log("Error fetching recipes:", err);
      console.log("Error status:", err?.response?.status);
      console.log("Error message:", err?.response?.data?.message);
      setError(err?.response?.data?.message || "Failed to load recipes");
      Toast.show({
        type: "error",
        text1: "Error",
        text2: err?.response?.data?.message || "Failed to load recipes",
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#000000" }}>
      <LinearGradient colors={["#2b0a0a", "#000000"]} style={{ flex: 1 }}>
        <TopBar title="My Recipes" />
        <ScrollView>
          {loading && (
            <View className="flex-1 justify-center items-center py-10">
              <Text className="text-white">Loading recipes...</Text>
            </View>
          )}
          {error && !loading && (
            <View className="flex-1 justify-center items-center py-10 px-4">
              <Text className="text-red-400 text-center">Error: {error}</Text>
            </View>
          )}
          {recipes.length === 0 && !loading && !error && (
            <View className="flex-1 justify-center items-center py-10">
              <Text className="text-gray-400">No recipes yet. Create one!</Text>
            </View>
          )}
          {recipes.map((recipe: RecipeCardProp) => (
            <View key={recipe._id}>
              <RecipeCard
                _id={recipe._id}
                title={recipe.title}
                ingredients={recipe.ingredients}
                imageURI={recipe.imageUrl}
                instructions={recipe.instructions}
                averageRating={recipe.averageRating}
                createdBy={recipe.createdBy}
              />
            </View>
          ))}
        </ScrollView>
        <Toast />
      </LinearGradient>
    </SafeAreaView>
  );
};

export default myrecipe;
