import { router } from "expo-router";
import React from "react";
import {
  Image,
  Platform,
  TouchableOpacity,
  View,
  Text,
  Dimensions,
  Button,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const ios = Platform.OS === "ios";

export default function ProfileScreen() {
  return (
    <LinearGradient colors={["#000", "#011", "#121"]} className="flex-1">
      <SafeAreaView className={ios ? "-mb-2" : "mb-3"}>
        <View className="flex-row justify-between items-center mx-4 my-2">
          <View>
            <Image
              className="flex-1 w-32"
              source={require("../../../assets/images/logo.png")}
            />
          </View>
          <TouchableOpacity onPress={() => router.replace("/search")}>
            <Feather name="search" size={30} color="white" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      <View className="flex items-center justify-center space-y-3 py-8">
        <Image
          className="w-48 h-40"
          source={require("../../../assets/images/login.jpg")}
        />
        <View className="flex items-center justify-center">
          <Text className="text-neutral-200 font-thin text-4xl">
            Login To Muvo
          </Text>
          <Text className="text-neutral-400 text-center italic">
            Unlock Unlimited Entertainment: Your Gateway to Free Streaming
            Bliss!
          </Text>
        </View>
        <View className="w-[70vw] pt-4">
          <TouchableOpacity className="bg-white rounded-xl py-3 items-center">
            <Text className="text-black text-lg">Log In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}
