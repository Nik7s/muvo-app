import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { FIREBASE_AUTH } from "@/firebaseConfig";
import { useAuth } from "@/src/context/auth";

var { width, height } = Dimensions.get("window");

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { signIn } = useAuth();

  const handleSignIn = async () => {
    setLoading(true);
    await signIn(email, password);
    setLoading(false);
  };

  return (
    <LinearGradient
      colors={["#000", "#011", "#121"]}
      className="flex-1 h-full w-full"
    >
      <SafeAreaView className="flex-row justify-center items-center z-20">
        <Image
          className="w-32 h-10"
          source={require("../../../assets/images/logo.png")}
        />
      </SafeAreaView>
      <View className="absolute">
        <Image
          style={{ width, height: height * 0.5 }}
          source={require("../../../assets/images/background.png")}
        />
        <LinearGradient
          colors={["transparent", "rgba(0, 17, 17, 0.8)", "rgba(0, 17, 17, 1)"]}
          style={{ width, height: height * 0.5 }}
          className="absolute"
        />
      </View>
      <View className="h-full w-full flex justify-center space-y-16 pb-10 z-10">
        <View className="flex items-center">
          <Text className="text-white font-bold tracking-widest text-6xl">
            Login
          </Text>
        </View>
        <View className="flex items-center mx-5 space-y-4">
          <View className="bg-white/10 p-5 rounded-2xl w-full">
            <TextInput
              value={email}
              onChangeText={(text) => setEmail(text)}
              placeholder="Email address"
              placeholderTextColor={"gray"}
              className="text-white"
            />
          </View>
          <View className="bg-white/10 p-5 rounded-2xl w-full mb-3">
            <TextInput
              value={password}
              onChangeText={(text) => setPassword(text)}
              placeholder="Password"
              placeholderTextColor={"gray"}
              secureTextEntry
              className="text-white"
            />
          </View>
          <View className="w-full">
            {loading ? (
              <ActivityIndicator size="large" color="rgb(34 197 94)" />
            ) : (
              <TouchableOpacity
                onPress={handleSignIn}
                className="w-full bg-green-400 p-3 rounded-2xl mb-5"
              >
                <Text className="text-xl font-bold text-white text-center">
                  Login
                </Text>
              </TouchableOpacity>
            )}
          </View>
          <View className="flex-row justify-center">
            <Text className="text-neutral-300">First time using Muvo? </Text>
            <TouchableOpacity onPress={() => router.replace("/register")}>
              <Text className="text-green-500">Create an account</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}
