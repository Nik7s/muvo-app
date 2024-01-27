import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import {
  FIRESTORE_DB as store,
  FIREBASE_AUTH as auth,
} from "@/firebase-config";
import { Feather } from "@expo/vector-icons";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

var { width, height } = Dimensions.get("window");

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const signUp = async (name: string, email: string, password: string) => {
    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const newUser = userCredential.user;
      await sendEmailVerification(newUser);
      await setDoc(doc(store, "Users", newUser.uid), {
        name: name,
        email: email,
        userId: newUser.uid,
        createdAt: newUser.metadata.creationTime!,
      });
      alert(
        "Registration successful. Please check your email for verification."
      );
    } catch (error: any) {
      alert("Registration failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={["#000", "#011", "#121"]}
      className="flex-1 h-full w-full"
    >
      <SafeAreaView className="flex-row justify-center items-center pt-7 z-20">
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
            Create Account
          </Text>
        </View>
        <View className="flex items-center mx-5 space-y-4">
          <View className="bg-white/10 p-4 rounded-2xl w-full">
            <TextInput
              value={name}
              onChangeText={(text) => setName(text)}
              placeholder="Full Name"
              placeholderTextColor={"gray"}
              className="text-white"
            />
          </View>
          <View className="bg-white/10 p-4 rounded-2xl w-full">
            <TextInput
              value={email}
              onChangeText={(text) => setEmail(text)}
              placeholder="Email address"
              placeholderTextColor={"gray"}
              className="text-white"
            />
          </View>
          <View className="bg-white/10 p-4 rounded-2xl w-full mb-5">
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
            onPress={() => signUp(name, email, password)}
            className="w-full bg-green-400 p-3 rounded-2xl mb-5 flex-row items-center justify-center space-x-4"
          >
            <Text className="text-xl font-bold text-white text-center">
              Sign Up
            </Text>
            {loading && <ActivityIndicator color="#aeae" />}
          </TouchableOpacity>
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
