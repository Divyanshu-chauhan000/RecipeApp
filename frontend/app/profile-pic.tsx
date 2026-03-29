import React, { useState, useEffect } from "react";
import { View, Text, Image, TextInput, Pressable, Alert } from "react-native";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import TopBar from "@/components/TopBar";
import * as ImagePicker from "expo-image-picker";
import api from "@/api/api";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";

const profilePicAvatar = require("../assets/LoginImages/profilePic.png");

const profilePic = () => {
  const { user, token, login } = useAuth();
  const [image, setImage] = useState<string | null>(null);
  const [fullName, setFullName] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || "");
      setImage(user.profilepic || null);
    }
  }, [user]);

  const imagePick = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        "Permission required",
        "Permission to access the media library is required",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    console.log(result);
    if (!result.canceled) {
      const selectedImage = result.assets[0];
      setImage(selectedImage.uri);

      const formData = new FormData();
      formData.append("image", {
        uri: selectedImage.uri,
        name: "profile.jpg",
        type: "image/jpeg",
      } as any);
      formData.append("fullName", fullName);

      try {
        setIsLoading(true);
        const res = await api.post("/user/upload-profile-pic", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        console.log("Cloudinary Url ", res.data.profilepic);
        setImage(res.data.profilepic);

        // Update AuthContext with new profile data
        await login(
          {
            ...user,
            profilepic: res.data.profilepic,
            fullName: res.data.fullName,
          },
          token || "",
        );

        Alert.alert("Success", "Profile updated successfully!");
        setIsLoading(false);
      } catch (error: unknown) {
        console.log("Full error:", error);

        let errorMessage = "Please try again";

        if (axios.isAxiosError(error)) {
          console.log("Error response:", error?.response?.data);
          errorMessage =
            error?.response?.data?.error ||
            error?.response?.data?.message ||
            "Please try again";
        }

        setIsLoading(false);
        Alert.alert("Upload failed", errorMessage);
      }
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
      <LinearGradient colors={["#2b0a0a", "#000000"]} style={{ flex: 1 }}>
        <TopBar title="Set-Profile" />
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ backgroundColor: "transparent" }}
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: 0,
            marginBottom: 0,
          }}
        >
          <View className="px-6 py-3 flex justify-center items-cente">
            <View>
              <Text className="text-3xl text-[#ccc] font-semibold mt-2 mb-3">
                Add a Photo
              </Text>
              <Text className="text-xl text-gray-400 leading-6 ">
                Personalize your account with your photo . You can always change
                is later
              </Text>
            </View>
            <View className="flex justify-center items-center p-4  ">
              {image ? (
                <Image
                  source={{ uri: image }}
                  style={{ width: 200, height: 200, borderRadius: 60 }}
                />
              ) : (
                <Image
                  source={profilePicAvatar}
                  style={{ width: 200, height: 200 }}
                />
              )}
            </View>
            <View>
              <Text className="text-gray-300 text-lg px-2 mb-2">Full Name</Text>
              <TextInput
                placeholder="Enter Your Name"
                value={fullName}
                onChangeText={setFullName}
                style={{
                  width: "100%",
                  backgroundColor: "#ccc",
                  borderRadius: 20,
                  paddingHorizontal: 15,
                  paddingVertical: 10,
                }}
              />
            </View>
            <Pressable onPress={imagePick} disabled={isLoading}>
              <Text className="bg-[#d95306] text-white p-3 text-center  mt-5 rounded-full ">
                {isLoading ? "Uploading..." : "Upload Image"}
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default profilePic;
