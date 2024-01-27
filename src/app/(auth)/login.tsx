import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import {
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { FIREBASE_AUTH as auth } from "@/firebase-config";
var { width, height } = Dimensions.get("window");

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignIn = async () => {
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      alert("Sign In failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset email sent. Please check your email.");
    } catch (error: any) {
      alert(`Error sending password reset email ${error}`);
    }
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
        <View className="flex mx-5">
          <Text className="text-white font-bold tracking-widest text-5xl">
            Welcome Back!
          </Text>
        </View>
        <View className="flex items-center mx-5 space-y-4">
          <View className="bg-white/10 p-4 rounded-2xl w-full">
            <TextInput
              value={email}
              onChangeText={(text) => setEmail(text)}
              placeholder="Email address"
              placeholderTextColor={"gray"}
              className="text-white"
            />
          </View>
          <View className="w-full mb-5">
            <View className="bg-white/10 p-4 rounded-2xl">
              <TextInput
                value={password}
                onChangeText={(text) => setPassword(text)}
                placeholder="Password"
                placeholderTextColor={"gray"}
                secureTextEntry={!showPassword}
                className="text-white"
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[18px]"
              >
                <Feather
                  name={showPassword ? "eye-off" : "eye"}
                  size={24}
                  color="#aeae"
                />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={handleForgotPassword}
              className="flex-row justify-end mt-2"
            >
              <Text className="text-green-500">Forgot Password?</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={handleSignIn}
            className="w-full bg-green-400 p-3 rounded-xl mb-5 flex-row items-center justify-center space-x-4"
          >
            <Text className="text-xl font-bold text-white text-center">
              Login
            </Text>
            {loading && <ActivityIndicator color="#aeae" />}
          </TouchableOpacity>
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
