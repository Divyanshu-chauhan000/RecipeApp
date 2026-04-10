import { useAuth } from "@/context/AuthContext";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { View, Text, Pressable,Image } from "react-native";
import { useRouter } from "expo-router";
// import {profilePic} from '../assets/LoginImages/profilePic.jpg'



const TopBar = ({ title }: { title: string }) => {
  const { user } = useAuth();
  const router = useRouter();

  return (
    <View>
      <View className="flex-row justify-between items-center px-6 py-4">
        <Text className="text-2xl font-bold text-white ">{title}</Text>
        <View className="flex-row justify-center items-center gap-2">
          {/* {user && user.fullName && (
            <Text className="text-sm  font-bold bg-[#5f291683] px-2 rounded-md p-1 text-white">
              {user.fullName}
            </Text>
          )} */}
       
            <Image className="rounded-full " source={{ uri: user?.profilepic  ||  'https://media.istockphoto.com/id/1495088043/vector/user-profile-icon-avatar-or-person-icon-profile-picture-portrait-symbol-default-portrait.jpg?s=612x612&w=0&k=20&c=dhV2p1JwmloBTOaGAtaA3AW1KSnjsdMt7-U_3EZElZ0='}} width={30} height={30} />
       
          <Pressable onPress={() => router.push("/create-recipe")}>
            <Ionicons
              name="add-circle"
              color={"rgb(208, 179, 171)"}
              size={30}
            />
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default TopBar;
