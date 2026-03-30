import React from "react";
import RecipeCard from "@/components/RecipeCard";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { Text, View, Pressable, TextInput } from "react-native";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { LinearGradient } from "expo-linear-gradient";
import TopBar from "@/components/TopBar";
import { Ionicons } from "@expo/vector-icons";
import { useFonts, Poppins_700Bold, Poppins_300Light } from '@expo-google-fonts/poppins'

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


const toprecipes = () => {
  const [recipes, setRecipes] = useState<RecipeCardProp[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<RecipeCardProp[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user } = useAuth();


    const [ fontLoad ] = useFonts({
      Poppins_700Bold,
      Poppins_300Light
  })

  useEffect(() => {
    getAllRecipes();
  }, []);

  // Real-time search filtering
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredRecipes(recipes);
    } else {
      const filtered = recipes.filter((recipe: RecipeCardProp) =>
        recipe.title.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilteredRecipes(filtered);
    }
  }, [searchQuery, recipes]);

  const getAllRecipes = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log(
        "Starting to fetch recipes from https://quickrecipe.onrender.com/api/recipes...",
      );

      // Increase timeout to 30 seconds - backend might be slow
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        console.log("Request timeout - aborting after 30 seconds");
        controller.abort();
      }, 30000); // 30 second timeout

      const startTime = Date.now();
      const res = await fetch("https://quickrecipe.onrender.com/api/recipes", {
        signal: controller.signal,
        headers: {
          Accept: "application/json",
        },
      });

      clearTimeout(timeoutId);
      const fetchTime = Date.now() - startTime;
      console.log(`Response received after ${fetchTime}ms`);

      console.log("Response status:", res.status);
      console.log("Response ok:", res.ok);

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      console.log("Recipes loaded successfully - Total recipes:", data.length);

      if (!Array.isArray(data)) {
        throw new Error("Invalid response format - expected array");
      }

      setRecipes(data);
      setFilteredRecipes(data);
    } catch (err: any) {
      console.error("ERROR fetching recipes:", err);
      console.error("Error name:", err?.name);
      console.error("Error message:", err?.message);
      console.error("Full error:", err);

      let errorMsg = "Failed to load recipes";

      if (err?.name === "AbortError") {
        errorMsg =
          "Connection timeout (30s) - Backend not responding. Make sure backend is running on port 5001";
      } else if (err?.message?.includes("Network")) {
        errorMsg = "Network error - Check your internet connection";
      } else if (err?.message?.includes("Invalid response")) {
        errorMsg = "Invalid response from server";
      } else {
        errorMsg = err?.message || "Failed to load recipes";
      }

      setError(errorMsg);

      Toast.show({
        type: "error",
        text1: "Error",
        text2: errorMsg,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
      <LinearGradient colors={["#2b0a0a", "#000000"]} style={{ flex: 1 }}>
        <Toast />
        <TopBar title="Top Recipes" />

        {/* Search Bar */}
        <View className="px-4 py-3  Poppins_700Bold">
          <View className="flex-row items-center bg-white/10 rounded-full px-4 py-2 border border-white/20">
            <Ionicons name="search" size={20} color="#d95306" />
            <TextInput
              placeholder="Search recipes..."
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={setSearchQuery}
              className="flex-1 ml-3 text-white"
            />
            {searchQuery !== "" && (
              <Pressable onPress={() => setSearchQuery("")}>
                <Ionicons name="close-circle" size={20} color="#999" />
              </Pressable>
            )}
          </View>
          <Text className="text-xs text-gray-400 mt-2 ml-2">
            Found {filteredRecipes.length} recipe
            {filteredRecipes.length !== 1 ? "s" : ""}
          </Text>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ backgroundColor: "transparent" }}
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: 20,
          }}
        >
          {loading && (
            <View className="flex-1 justify-center items-center py-10">
              <Text className="text-white">Loading recipes...</Text>
            </View>
          )}

          {error && !loading && (
            <View className="flex-1 justify-center items-center py-10 px-4">
              <Text className="text-red-400 text-center">Error: {error}</Text>
              <Pressable
                onPress={getAllRecipes}
                className="mt-4 px-4 py-2 bg-[#d95306] rounded-full"
              >
                <Text className="text-white">Retry</Text>
              </Pressable>
            </View>
          )}
                  
          {!loading &&
            !error &&
            filteredRecipes.length === 0 &&
            searchQuery !== "" && (
              <View className="flex-1 justify-center items-center py-10">
                <Ionicons name="search" size={48} color="#666" />
                <Text className="text-gray-400 mt-2">No recipes found</Text>
                <Text className="text-gray-500 text-xs mt-1">
                  Try searching with different keywords
                </Text>
              </View>
            )}

          {!loading &&
            !error &&
            filteredRecipes.length === 0 &&
            searchQuery === "" && (
              <View className="flex-1 justify-center items-center py-10">
                <Text className="text-gray-400">No recipes available</Text>
              </View>
            )}

          {filteredRecipes.map((recipe: RecipeCardProp) => (
            <View key={recipe._id}>
              <RecipeCard
                title={recipe.title}
                _id={recipe._id}
                averageRating={recipe.averageRating}
                ingredients={recipe.ingredients}
                imageURI={recipe.imageUrl}
                instructions={recipe.instructions}
                createdBy={recipe.createdBy}
              />
            </View>
          ))}
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default toprecipes; 
