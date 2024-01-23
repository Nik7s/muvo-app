import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

var { width, height } = Dimensions.get("window");

export default function SignupScreen() {
  return (
    <LinearGradient
      colors={["#000", "#011", "#121"]}
      className="flex-1 h-full w-full"
    >
      <StatusBar style="light" />
      <View className="absolute">
        <Image
          style={{ width, height: height * 0.5 }}
          source={require("../../../assets/images/background.png")}
        />
        <LinearGradient
          colors={["transparent", "rgba(0, 17, 17, 0.8)", "rgba(0, 17, 17, 1)"]}
          style={{ width, height: height * 0.5 }}
          className="absolute bottom-0 z-10"
        />
      </View>
      <View className="h-full w-full flex justify-evenly pt-48 pb-10 z-10">
        <View className="flex items-center">
          <Text className="text-white font-bold tracking-widest text-6xl">
            Sign Up
          </Text>
        </View>
        <View className="flex items-center mx-5 space-y-4">
          <View className="bg-black/50 p-5 rounded-2xl w-full">
            <TextInput
              placeholder="Username"
              placeholderTextColor={"gray"}
              className="text-white"
            />
          </View>
          <View className="bg-black/50 p-5 rounded-2xl w-full">
            <TextInput
              placeholder="Email"
              placeholderTextColor={"gray"}
              className="text-white"
            />
          </View>
          <View className="bg-black/50 p-5 rounded-2xl w-full mb-3">
            <TextInput
              placeholder="Password"
              placeholderTextColor={"gray"}
              secureTextEntry
              className="text-white"
            />
          </View>
          <View className="w-full">
            <TouchableOpacity className="w-full bg-green-400 p-3 rounded-2xl mb-5">
              <Text className="text-xl font-bold text-white text-center">
                SignUp
              </Text>
            </TouchableOpacity>
          </View>
          <View className="flex-row justify-center">
            <Text className="text-neutral-300">Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push("/login")}>
              <Text className="text-green-500">Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}
