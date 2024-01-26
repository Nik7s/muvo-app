import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, Platform, TouchableOpacity, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { signOut } from "firebase/auth";
import { FIREBASE_AUTH, FIRESTORE_DB } from "@/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import WatchList from "@/src/components/WatchList";

const ios = Platform.OS === "ios";

interface UserData {
  name: string;
}

export default function ProfileScreen() {
  const auth = FIREBASE_AUTH;
  const [user, setUser] = useState<UserData | null>(null);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.navigate("/login");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = auth.currentUser?.uid;
      if (userId) {
        try {
          const userDoc = await getDoc(doc(FIRESTORE_DB, "Users", userId));
          setUser(userDoc.data() as UserData);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, [auth]);
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
      <View className="flex-1 space-y-3 py-3">
        {user ? (
          <View className="flex-1 space-y-4">
            <View className="flex-row border-b border-neutral-800 pb-5 px-3">
              <View className="flex-1">
                <Text className="text-neutral-300 font-light text-base">
                  Welcome back,
                </Text>
                <Text className="text-neutral-100 font-medium text-xl">
                  {user.name}
                </Text>
              </View>
              <TouchableOpacity
                className="bg-white rounded-md px-4 items-center justify-center"
                onPress={handleSignOut}
              >
                <Text className="text-lg">Sign Out</Text>
              </TouchableOpacity>
            </View>
            <View>
              <WatchList />
            </View>
          </View>
        ) : (
          <>
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
              <TouchableOpacity
                className="bg-white rounded-xl py-3 items-center"
                onPress={() => router.navigate("/login")}
              >
                <Text className="text-black text-lg">Log In</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </LinearGradient>
  );
}
