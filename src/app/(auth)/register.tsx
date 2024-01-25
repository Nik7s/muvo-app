import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { FIREBASE_AUTH, FIRESTORE_DB } from "@/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

var { width, height } = Dimensions.get("window");

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const auth = FIREBASE_AUTH;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.replace("/(tabs)/home");
      }
    });

    return () => unsubscribe();
  }, [auth]);

  const register = async () => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await setDoc(doc(FIRESTORE_DB, "Users", user.uid), {
        name: name,
        email: email,
      });
    } catch (error: any) {
      console.log(error);
      Alert.alert("Registration failed: " + error.message);
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
        <View className="flex items-center">
          <Text className="text-white font-bold tracking-widest text-6xl">
            Register
          </Text>
        </View>
        <View className="flex items-center mx-5 space-y-4">
          <View className="bg-white/10 p-5 rounded-2xl w-full">
            <TextInput
              value={name}
              onChangeText={(text) => setName(text)}
              placeholder="Name"
              placeholderTextColor={"gray"}
              className="text-white"
            />
          </View>
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
                onPress={register}
                className="w-full bg-green-400 p-3 rounded-2xl mb-5"
              >
                <Text className="text-xl font-bold text-white text-center">
                  Sign Up
                </Text>
              </TouchableOpacity>
            )}
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
