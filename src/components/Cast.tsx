import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import React from "react";
import { router } from "expo-router";
var { width, height } = Dimensions.get("window");

interface CastProps {
  cast: any;
}

export default function Cast({ cast }: CastProps) {
  return (
    <View className="my-6">
      <Text className="text-white text-lg mx-4 mb-5">Top Cast</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 15 }}
      >
        {cast &&
          cast.map((person: any, index: number) => {
            return (
              <TouchableOpacity key={index} className="mr-4 items-center">
                <View className="overflow-hidden rounded-full h-20 w-20 items-center">
                  <Image
                    className="rounded-2xl h-24 w-20"
                    source={require("../../assets/images/castImage2.png")}
                  />
                </View>

                <Text className="text-white text-xs mt-1">John Wick</Text>
                <Text className="text-neutral-400 text-xs">Keenu Reaves</Text>
              </TouchableOpacity>
            );
          })}
      </ScrollView>
    </View>
  );
}
