import React from "react";
import { Image, Text, View } from "react-native";
import RateRecipe from "./RateRecipe";
import { useAuth } from "@/context/AuthContext";

type RecipeCardProp = {
  _id: string;
  title: string;
  imageURI: string;
  ingredients: string[];
  instructions: string;
  averageRating: number;
  createdBy: {
    _id: string;
    fullName: string;
    profilepic: string;
  };
};

const RecipeCard = ({
  imageURI,
  title,
  ingredients,
  instructions,
  _id,
  averageRating,
  createdBy,
}: RecipeCardProp) => {

  const {user} = useAuth();
  return (
    <View className="p-4">
      <View className="   rounded-2xl shadow-lg overflow-hidden ">
        <View >
          <Image
            source={{ uri: imageURI }}
            className="h-64 w-full object-cover rounded-2xl"
          />
          {/* <View className="absolute bottom-0 w-full h-16 bg-black/40" /> */}
        </View>
        <View className="p-2  gap-2">
          <View className=" ">
            <Text className="text-xl  font-semibold text-white ">
              {title}
            </Text>
            <View className="flex-row items-center gap-2">
              <View className="flex-row  items-center gap-3 my-1">
                <Image 
                  source={{uri : createdBy?.profilepic || 'https://media.istockphoto.com/id/1495088043/vector/user-profile-icon-avatar-or-person-icon-profile-picture-portrait-symbol-default-portrait.jpg?s=612x612&w=0&k=20&c=dhV2p1JwmloBTOaGAtaA3AW1KSnjsdMt7-U_3EZElZ0='}} 
                  className="w-8 h-8 rounded-full" 
                />
                <Text className="text-xs text-gray-300 ">{createdBy?.fullName || 'Unknown'}</Text>
              </View>
            </View>
          </View>
          {/* {ingredients.map((ing: string) => (
            <Text className="text-sm text-gray-300 ml-3" key={ing}>
              {" "}
              {ing}
            </Text>
          ))}
          <Text className="font-semibold text-white mt-2 ">Instructions: </Text>
          <Text className="text:sm text-gray-300 ">{instructions}</Text> */}
          <View className="  py-1 rounded-lg">
            <RateRecipe recipeId={_id} initialRating={averageRating} />
          </View>
        </View>
      </View>
    </View>
  );
};

export default RecipeCard;

// https://thumbs.dreamstime.com/b/indian-tea-spices-masala-chai-33827904.jpg?w=992
// https://i.pinimg.com/736x/fb/79/e7/fb79e79cee416e53b19b319b002b122a.jpg
