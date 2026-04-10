import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TextInput,
  Pressable,
  Alert,
} from "react-native";
import { useAuth } from "@/context/AuthContext";
import { GetRecipeDetail, PostRecipeReview } from "@/services/recipe.service";
import StarRating from 'react-native-star-rating-widget';

const recipeDesc = () => {
  const { id } = useLocalSearchParams();
  const { user } = useAuth();
  const [recipe, setRecipe] = useState<any>(null);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState<number>(0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (id) fetchRecipe();
  }, [id]);

  const fetchRecipe = async () => {
    try {
      const res = await GetRecipeDetail(id as string);
      setRecipe(res.data);
    } catch (err: any) {
      console.log("Fetch recipe error:", err.response?.data || err.message);
    }
  };

  const submitReview = async () => {
    if (rating < 1 || rating > 5) {
      Alert.alert("Validation", "Rating must be between 1 and 5");
      return;
    }

    if (comment.trim().length < 3) {
      Alert.alert("Validation", "Please enter a comment (min 3 chars)");
      return;
    }

    try {
      await PostRecipeReview(id as string, {
        rating,
        comment,
      });
      setComment("");
      setRating(0);
      Alert.alert("Success", "Review submitted successfully");
      fetchRecipe();
    } catch (err: any) {
      console.log("Submit review error:", err.response?.data || err.message);
      Alert.alert("Error", "Could not save review");
    }
  };

  if (!recipe) return <Text className="text-white">Loading...</Text>;

  return (
    <ScrollView className="flex-1 bg-[#2b0000]">
      
      {/* 🔥 Top Image */}
      <View className="relative">
        <Image
          source={{ uri: recipe.image }}
          className="w-full h-64"
        />

        {/* Overlay */}
        <View className="absolute bottom-0 w-full p-4 bg-black/40">
          <Text className="text-white text-2xl font-bold">
            {recipe.title}
          </Text>
        </View>
      </View>

      <View className="p-4">
        
        {/* ⭐ Rating */}
        <View className="flex-row items-center mb-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Text
              key={i}
              className={
                i < (recipe.averageRating || 0)
                  ? "text-yellow-400 text-lg"
                  : "text-gray-600 text-lg"
              }
            >
              ★
            </Text>
          ))}
          <Text className="text-white ml-2">
            {recipe.averageRating?.toFixed(1) || 0} ({recipe.ratingCount || 0} reviews)
          </Text>
        </View>

        {/* 📄 Description */}
        <Text className="text-gray-200 mb-4">
          {recipe.instructions || recipe.description || "No description provided."}
        </Text>

        {/* 🥗 Ingredients */}
        <Text className="text-white text-lg font-semibold mb-2">
          Ingredients
        </Text>

        <View className="flex-row flex-wrap gap-2 mb-4">
          {recipe.ingredients.map((item: string, i: number) => (
            <View
              key={i}
              className="bg-gradient-to-r from-orange-500 to-red-500 px-3 py-2 rounded-full shadow-md"
            >
              <Text className="text-white text-sm font-medium">{item}</Text>
            </View>
          ))}
        </View>

        {/* 💬 Reviews */}
        <Text className="text-white text-lg font-semibold mb-2">
          Reviews
        </Text>

        {(recipe.reviews || []).length === 0 && (
          <Text className="text-gray-400 mb-2">No reviews yet. Be the first!</Text>
        )}

        {(recipe.reviews || []).map((rev: any, i: number) => (
          <View key={i} className="bg-gradient-to-r from-[#3a0000] to-[#2a0000] p-4 rounded-xl mb-3 shadow-lg border border-[#4a0000]">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-white font-semibold text-base">
                {rev.user || "Anonymous"}
              </Text>
              <Text className="text-gray-400 text-xs">
                {new Date(rev.createdAt).toLocaleDateString()}
              </Text>
            </View>

            <View className="flex-row items-center mb-2">
              {Array.from({ length: 5 }).map((_, starIndex) => (
                <Text
                  key={starIndex}
                  className={
                    starIndex < (rev.rating || 0)
                      ? "text-yellow-400 text-lg"
                      : "text-gray-600 text-lg"
                  }
                >
                  ★
                </Text>
              ))}
            </View>

            <Text className="text-gray-300 leading-5">{rev.comment}</Text>
          </View>
        ))}

        {/* ✍️ Add Review */}
        {user ? (
          <>
            <Text className="text-white text-lg font-semibold mt-4 mb-2">
              Add Review
            </Text>

            <View className="mb-3">
              <Text className="text-white mb-1">Rating:</Text>
              <StarRating
                rating={rating}
                onChange={setRating}
                starSize={30}
                color="#FFD700"
                emptyColor="#666"
              />
            </View>

            <TextInput
              placeholder="Write your review..."
              placeholderTextColor="#aaa"
              value={comment}
              onChangeText={setComment}
              multiline
              className="bg-[#4a0000] text-white p-3 rounded-lg mb-3 h-24"
            />

            <Pressable
              onPress={submitReview}
              className="bg-orange-500 p-3 rounded-xl items-center"
            >
              <Text className="text-white font-semibold">
                Submit Review
              </Text>
            </Pressable>
          </>
        ) : (
          <Text className="text-gray-400 mt-4">Please log in to add a review.</Text>
        )}
      </View>
    </ScrollView>
  );
}

export default recipeDesc;
