import React from "react";
import { router } from "expo-router";
import { Image, Platform, TouchableOpacity, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import WatchList from "@/src/components/WatchList";
import { useAuth } from "@/src/context/auth";

const ios = Platform.OS === "ios";

export default function ProfileScreen() {
  const { user, signOut } = useAuth();

  const handleSignOut = () => {
    try {
      signOut();
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

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
      <View className="flex-1 py-3">
        <View className="space-y-6">
          <View className="flex-row border-b border-neutral-800 pb-5 px-3">
            <View className="flex-1">
              <Text className="text-neutral-300 font-light text-base">
                Welcome back,
              </Text>
              <Text className="text-neutral-100 font-medium text-xl">
                {user?.name}
              </Text>
            </View>
            <TouchableOpacity
              className="bg-white rounded-md px-6 items-center justify-center"
              onPress={handleSignOut}
            >
              <Text className="text-lg">Sign Out</Text>
            </TouchableOpacity>
          </View>
          <View>
            <WatchList />
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}
