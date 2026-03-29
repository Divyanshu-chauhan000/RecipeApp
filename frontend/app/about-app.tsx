import React from 'react'
import { View , Text, ScrollView } from 'react-native'
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import TopBar from "@/components/TopBar";

const aboutapp = () => {
  return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
      <LinearGradient colors={["#2b0a0a", "#000000"]} style={{ flex: 1 }}>
        <TopBar title="About Application" />
       <ScrollView showsVerticalScrollIndicator={false}>
      <View className='p-4'>

         <View className="bg-[#5f291683] p-4 rounded-2xl mb-4 border border-[#222]">
              <Text className="text-3xl text-white font-bold mb-1">
                🍲 RecipeApp
              </Text>
              <Text className="text-gray-400">
                Discover, save & share delicious recipes easily.
              </Text>
            </View>

        {/* Introduction */}
         <View className="bg-[#5f291683] p-4 rounded-2xl mb-4 border border-[#222]">
              <Text className="text-lg text-white font-semibold mb-2">
                About
              </Text>
              <Text className="text-gray-400 leading-6">
                RecipeApp is your go-to platform to discover, save, and share
                delicious recipes. Whether you're a beginner or a pro chef,
                we make cooking simple and fun.
              </Text>
            </View>

         <View className="bg-[#5f291683] p-4 rounded-2xl mb-4 border border-[#222]">
              <Text className="text-lg text-white font-semibold mb-2">
                Features 
              </Text>

              {[
                "Explore thousands of recipes",
                "Search by ingredients",
                "Save favorite recipes",
                "Share with friends",
                "Step-by-step instructions"
              ].map((item, index) => (
                <Text key={index} className="text-gray-400 mb-1">
                  • {item}
                </Text>
              ))}
            </View>

               <View className="bg-[#5f291683] p-4 rounded-2xl mb-4 border border-[#222]">
              <Text className="text-lg text-white font-semibold mb-2">
                Our Mission 
              </Text>
              <Text className="text-gray-400 leading-6">
                We aim to make cooking accessible to everyone and bring people
                closer through food.
              </Text>
            </View>

        {/* Developer Info */}
       <View className="bg-[#5f291683] p-4 rounded-2xl mb-4 border border-[#222]">
              <Text className="text-lg text-white font-semibold mb-2">
                App Info 
              </Text>

              <View className="flex-row justify-between mb-2">
                <Text className="text-gray-400">Developer</Text>
                <Text className="text-white">Divyanshu Chauhan</Text>
              </View>

              <View className="flex-row justify-between">
                <Text className="text-gray-400">Version</Text>
                <Text className="text-white">1.0.0</Text>
              </View>
            </View>

    
        {/* Contact */}
       <View className="bg-[#5f291683] p-4 rounded-2xl mb-6 border border-[#222]">
              <Text className="text-lg text-white font-semibold mb-2">
                Contact 
              </Text>

              <Text className="text-gray-400 mb-1">
                📱 +91 9720-120XXX
              </Text>
              <Text className="text-gray-400 mb-1">
                📧 support@recipeapp.com
              </Text>
              <Text className="text-gray-400">
                📍 India
              </Text>
            </View>


        {/* Footer */}
        <Text className="text-center text-gray-600 mb-4">
              Made with ❤️ by divyanshu
            </Text>
 
      </View>
    </ScrollView>
    </LinearGradient>
    </SafeAreaView>
  )
}

export default aboutapp
