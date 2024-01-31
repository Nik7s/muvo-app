import React, { useState } from "react";
import {
  Image,
  Platform,
  TouchableOpacity,
  View,
  Text,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import WatchList from "@/src/components/WatchList";
import { useAuth } from "@/src/context/auth";
import { SettingsModal } from "@/src/components";

const ios = Platform.OS === "ios";

export default function ProfileScreen() {
  const { user } = useAuth();
  const [isModalVisible, setModalVisible] = useState(false);

  return (
    <LinearGradient colors={["#000", "#011", "#121"]} className="flex-1">
      <SafeAreaView className={ios ? "-mb-2" : "mb-3"}>
        <View className="flex-row justify-between items-center mx-4 my-2">
          <View>
            <Image
              className="w-32 h-8"
              source={require("../../../assets/images/logo.png")}
            />
          </View>
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            className="flex-row items-center space-x-1"
          >
            <Ionicons name="settings-outline" size={22} color="white" />
            <Text className="text-neutral-100">Settings</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      <SettingsModal
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
      />
      <View className="flex-1 pb-3">
        <View className="flex-row border-b border-neutral-800 pb-2 px-3">
          <View className="flex-1">
            <Text className="text-neutral-300 font-light text-base">
              Welcome back,
            </Text>
            <Text className="text-neutral-100 font-medium text-xl">
              {user?.name}
            </Text>
          </View>
          <View>
            <Text className="text-neutral-300 font-light text-base">
              Member since
            </Text>
            <Text className="text-neutral-100 font-medium text-xl">
              {user?.createdAt &&
                new Date(user.createdAt).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
            </Text>
          </View>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40, paddingTop: 10 }}
        >
          <WatchList />
        </ScrollView>
      </View>
    </LinearGradient>
  );
}
