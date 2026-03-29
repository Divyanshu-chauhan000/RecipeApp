import { useRouter } from "expo-router";
import { BlurView } from "expo-blur";
import React, { useState } from "react";
import {
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Image,
  ActivityIndicator,
} from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { recipeFormSchema } from "../schema/form";
import { CreateRecipe } from "../services/recipe.service";
import Toast from "react-native-toast-message";
import * as ImagePicker from "expo-image-picker";
import api from "../api/api";

const createRecipe = () => {
  const router = useRouter();
  const [image, setImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(recipeFormSchema),
    defaultValues: {
      title: "",
      ingredients: [],
      instructions: "",
      imageUrl: "",
    },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "ingredients",
    shouldUnregister: true,
  });

  const [inputChip, setInputChip] = useState("");

  const tryAppend = async (text: string) => {
    const trimmed = text.trim();
    if (trimmed && !fields.some((f) => f.value === trimmed)) {
      append({ value: trimmed });
      setInputChip("");
    }
  };

  const onSubmit = async (data: any) => {
    console.log("Form submitted with data:", data);
    console.log(
      "Fields:",
      fields.map((f) => f.value),
    );
    console.log("Image:", image);

    setIsLoading(true);

    try {
      let imageUrl = data.imageUrl || "";

      // If image is selected, upload it first
      if (image) {
        console.log("Uploading image...");
        const formData = new FormData();
        formData.append("image", {
          uri: image,
          name: "recipe.jpg",
          type: "image/jpeg",
        } as any);

        const uploadRes = await api.post(
          "/recipes/upload-recipe-image",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );

        imageUrl = uploadRes.data.imageUrl;
        console.log("Image uploaded successfully:", imageUrl);
      }

      const payLoad = {
        title: data.title,
        ingredients: fields.map((f) => f.value),
        instructions: data.instructions,
        imageUrl: imageUrl,
      };

      console.log("Creating recipe with payload:", payLoad);

      const res = await CreateRecipe(payLoad);
      console.log("Recipe creation response:", res);

      if (res) {
        Toast.show({
          type: "success",
          text1: "Created",
          text2: "Recipe Created",
        });
        router.push("/my-recipe");
      }
    } catch (error) {
      console.error("Recipe creation error:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to create recipe",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Adding photo upload feature
  const openCamera = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      alert("Camera permission is required");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 1,
      allowsEditing: true,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const openGallery = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      alert("Gallery permission is required");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      quality: 1,
      allowsEditing: true,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
    >
      <Animated.View
        entering={FadeIn.duration(200)}
        className="flex-1 justify-center "
      >
        <Toast />
        <ImageBackground
          source={require("../assets/LoginImages/burger.png")}
          className="flex-1"
          resizeMode="cover"
        >
          <View className="flex-1 bg-black/70 justify-center items-center">
            <BlurView
              intensity={20}
              tint="light"
              className="w-[90%] rounded-3xl overflow-hidden border border-white/20 bg-white/10"
            >
              <View className="bg-white/10 border border-white/30 rounded-[30px] p-5">
                <View className="absolute top-0 left-0 right-0 h-10 bg-white/20 rounded-t-[30px]" />
                <View className="m-2  rounded-lg">
                  <SafeAreaView className="flex flex-row justify-between items-center px-4">
                    <Text className="text-4xl font-bold  text-[#de7040]">
                      Create Recipe
                    </Text>
                    <TouchableOpacity onPress={() => router.back()}>
                      <Text className="px-3 py-1 text-xl bg-white/20 rounded-full text-white">
                        x
                      </Text>
                    </TouchableOpacity>
                  </SafeAreaView>
                  <ScrollView
                    className="p-4"
                    contentContainerStyle={{
                      flexGrow: 1,
                      paddingBottom: 100, // Extra space for keyboard
                    }}
                    keyboardShouldPersistTaps="handled"
                    keyboardDismissMode="on-drag"
                    showsVerticalScrollIndicator={false}
                  >
                    <Text className="mb-1 font-semibold text-[#de7040]">
                      Title{" "}
                    </Text>
                    <Controller
                      control={control}
                      name="title"
                      render={({ field: { value, onChange } }) => (
                        <>
                          <TextInput
                            placeholder="Please Enter Title"
                            placeholderTextColor={"white"}
                            value={value}
                            onChangeText={onChange}
                            autoCapitalize="words"
                            autoCorrect={false}
                            className="bg-white/20 text-white p-3 rounded-xl border border-white/20"
                          />
                        </>
                      )}
                    />

                    <Text className="mt-3 mb-1 font-semibold text-[#de7040]">
                      Ingredients
                    </Text>
                    <Controller
                      control={control}
                      name="ingredients"
                      render={() => (
                        <>
                          <View className=" flex flex-row flex-wrap items-center">
                            {fields.map((field, i) => (
                              <View
                                key={field.id}
                                className="flex-row bg-[#eeeee] rounded-[16px] px-2 py-1 m-1"
                              >
                                <Text className="mr-4">{field.value}</Text>
                                <TouchableOpacity
                                  onPress={async () => {
                                    remove(i);
                                  }}
                                >
                                  <Text className="font-bold ">x</Text>
                                </TouchableOpacity>
                              </View>
                            ))}
                            <TextInput
                              placeholder='"Add ingredients...'
                              placeholderTextColor={"white"}
                              className={`bg-white/20 w-full text-white p-3 rounded-xl border border-white/20
            ${errors.ingredients ? "border-red-700" : ""}`}
                              value={inputChip}
                              onChangeText={(text) => {
                                setInputChip(text);
                                if (text.endsWith(",")) {
                                  tryAppend(text.slice(0, -1));
                                }
                              }}
                              onEndEditing={() =>
                                inputChip.trim() && tryAppend(inputChip)
                              }
                              blurOnSubmit={false}
                              returnKeyType="done"
                              autoCapitalize="words"
                              autoCorrect={false}
                            />
                          </View>
                          {errors.ingredients && (
                            <Text className="mt-1 text-red-700">
                              {errors.ingredients.message}
                            </Text>
                          )}
                        </>
                      )}
                    />

                    <Text className="mt-3 mb-1 font-semibold text-[#de7040]">
                      Instructions
                    </Text>
                    <Controller
                      control={control}
                      name="instructions"
                      render={({ field: { value, onChange } }) => (
                        <>
                          <TextInput
                            multiline
                            placeholder="Please Enter Instructions"
                            placeholderTextColor={"white"}
                            value={value}
                            onChangeText={onChange}
                            className={`bg-white/20 text-white p-3 rounded-xl border border-white/20
            ${errors.instructions ? "border-red-700" : ""} h-[100px]`}
                            textAlignVertical="top"
                            autoCapitalize="sentences"
                            autoCorrect={true}
                          />
                          {errors.instructions && (
                            <Text className="mt-1 text-red-700">
                              {errors.instructions.message}
                            </Text>
                          )}
                        </>
                      )}
                    />

                    <Text className="mt-3 mb-3 font-semibold text-[#de7040]">
                      Recipe Image
                    </Text>

                    {/* Image Preview */}
                    {image && (
                      <View className="mb-4 items-center">
                        <Image
                          source={{ uri: image }}
                          className="w-32 h-32 rounded-xl border-2 border-white/30"
                          resizeMode="cover"
                        />
                        <TouchableOpacity
                          onPress={() => setImage(null)}
                          className="absolute -top-2 -right-2 bg-red-500 rounded-full w-6 h-6 items-center justify-center"
                        >
                          <Text className="text-white font-bold text-xs">
                            ×
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}

                    {/* Upload Options */}
                    <View className="flex-row justify-between gap-3 mb-5">
                      <TouchableOpacity
                        onPress={openCamera}
                        className="flex-1 bg-white/20 border border-white/30 rounded-xl p-3 items-center"
                        disabled={isLoading}
                      >
                        <Text className="text-white font-medium text-center">
                          Camera
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={openGallery}
                        className="flex-1 bg-white/20 border border-white/30 rounded-xl p-3 items-center"
                        disabled={isLoading}
                      >
                        <Text className="text-white font-medium text-center">
                          Gallery
                        </Text>
                      </TouchableOpacity>
                    </View>

                    {/* Submit Button */}
                    <TouchableOpacity
                      onPress={handleSubmit(onSubmit)}
                      disabled={isLoading}
                      className={`bg-[#de7040] rounded-xl p-4 items-center ${
                        isLoading ? "opacity-50" : ""
                      }`}
                    >
                      {isLoading ? (
                        <View className="flex-row items-center">
                          <ActivityIndicator color="#fff" size="small" />
                          <Text className="text-white font-semibold ml-2">
                            Creating Recipe...
                          </Text>
                        </View>
                      ) : (
                        <Text className="text-white font-semibold text-center">
                          Submit Recipe
                        </Text>
                      )}
                    </TouchableOpacity>
                  </ScrollView>
                </View>
              </View>
            </BlurView>
          </View>
        </ImageBackground>
      </Animated.View>
    </KeyboardAvoidingView>
  );
};

export default createRecipe;

// https://picsum.photos/id/237/200/300
// https://www.shutterstock.com/image-photo/set-shortlink-welded-chain-zinc-600w-2133469855.jpg
