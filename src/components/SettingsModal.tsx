import React from "react";
import {
  Platform,
  SafeAreaView,
  TouchableOpacity,
  View,
  Text,
} from "react-native";
import Modal from "react-native-modal";
import { useAuth } from "../context/auth";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";

type SettingsModalProps = {
  isVisible: boolean;
  onClose: () => void;
};

const ios = Platform.OS === "ios";

const SettingsModal = ({ isVisible, onClose }: SettingsModalProps) => {
  const { user, signOut } = useAuth();

  const handleSignOut = () => {
    try {
      signOut();
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };
  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      animationIn="slideInRight"
      animationOut="slideOutRight"
      presentationStyle="overFullScreen"
      useNativeDriver
      className="m-0"
    >
      <LinearGradient colors={["#000", "#011", "#121"]} className="flex-1">
        <SafeAreaView
          className={`${ios ? "-mb-2" : "mb-3"} border-b border-neutral-800`}
        >
          <View className="flex-row items-center px-4 mb-2 space-x-4">
            <TouchableOpacity onPress={onClose}>
              <MaterialIcons
                name="keyboard-backspace"
                size={26}
                color="white"
              />
            </TouchableOpacity>
            <Text className="text-neutral-100 font-medium text-xl">
              Help & Settings
            </Text>
          </View>
        </SafeAreaView>
        <View className="flex-row px-4 space-x-6 pb-5">
          <FontAwesome5
            name="user-circle"
            size={24}
            color="white"
            style={{ paddingTop: 10 }}
          />
          <View className="flex-1 space-y-4">
            <View className="border-b border-neutral-800 pb-2">
              <Text className="text-neutral-100 font-medium text-base">
                Account Details
              </Text>
              <Text className="text-neutral-400 font-light text-sm">
                User Info and other details
              </Text>
            </View>
            <View>
              <View className="flex-row space-x-2 items-center mb-2">
                <Text className="text-neutral-400 text-base font-light">
                  Name:
                </Text>
                <Text className="text-neutral-100 font-semibold text-base">
                  {user?.name}
                </Text>
              </View>
              <View className="flex-row space-x-2 items-center mb-2">
                <Text className="text-neutral-400 text-base font-light">
                  Email:
                </Text>
                <Text className="text-neutral-100 font-semibold text-base">
                  {user?.email}
                </Text>
              </View>
              <View className="flex-row space-x-2 items-center mb-2">
                <Text className="text-neutral-400 text-base font-light">
                  Created at:
                </Text>
                <Text className="text-neutral-100 font-semibold text-base">
                  {user?.createdAt &&
                    new Date(user.createdAt).toLocaleString("en-US", {
                      timeZone: "Asia/Kolkata",
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "numeric",
                      minute: "numeric",
                      second: "numeric",
                    })}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View className="flex-1 items-center justify-end mb-4">
          <TouchableOpacity
            className="rounded-md px-6 py-2 mb-4 items-center justify-center"
            onPress={handleSignOut}
          >
            <Text className="text-lg text-green-500">Log Out</Text>
          </TouchableOpacity>
          <View className="flex-col items-center space-y-1">
            <Text className="font-extralight text-xs text-neutral-300">
              App version: 1.2.4
            </Text>
            <Text className="font-extralight text-xs text-neutral-300">
              &copy; {new Date().getFullYear()} Muvo. All rights reserved.
              Developed by{" "}
              <Text
                className="text-green-200 font-light"
                onPress={() =>
                  WebBrowser.openBrowserAsync("https://github.com/rishabh1s")
                }
              >
                rishabh1s
              </Text>
            </Text>
          </View>
        </View>
      </LinearGradient>
    </Modal>
  );
};

export default SettingsModal;
