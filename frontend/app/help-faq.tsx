import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { ScrollView } from "react-native";
import TopBar from "@/components/TopBar";



const faqs = [
  {
    question: "How do I search recipes?",
    answer: "You can use the search bar on the home screen to find recipes by name or ingredients.",
  },
  {
    question: "How can I save recipes?",
    answer: "Tap on the bookmark icon on any recipe to save it to your favorites.",
  },
  {
    question: "Can I share recipes?",
    answer: "Yes, you can share recipes with your friends using the share button.",
  },
  {
    question: "Do I need an account?",
    answer: "Yes, creating an account helps you save and manage your favorite recipes.",
  },
];

const FAQSection = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggle = (index ) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#000000" }}>
      <LinearGradient colors={["#2b0a0a", "#000000"]} style={{ flex: 1 }}>
        <TopBar title="Help/FAQ" />
        <ScrollView>
    <View className="#441616 p-4 rounded-2xl mb-4 border border-[#222]">
      <Text className="text-lg text-white font-semibold mb-3">
        Help / FAQ ❓
      </Text>

      {faqs.map((item, index) => (
        <View key={index} className="mb-2">
          <TouchableOpacity
            onPress={() => toggle(index)}
            className="flex-row justify-between items-center py-2"
          >
            <Text className="text-gray-300 font-medium">
              {item.question}
            </Text>
            <Text className="text-gray-500">
              {activeIndex === index ? "-" : "+"}
            </Text>
          </TouchableOpacity>

          {activeIndex === index && (
            <Text className="text-gray-400 mt-1 leading-5">
              {item.answer}
            </Text>
          )}
        </View>
      ))}
    </View>
    </ScrollView>
    </LinearGradient>
    </SafeAreaView>
  );
};

export default FAQSection;