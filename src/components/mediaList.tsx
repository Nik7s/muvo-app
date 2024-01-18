import {
  View,
  Text,
  ScrollView,
  TouchableWithoutFeedback,
  Image,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { styles } from "../theme";
import { router } from "expo-router";
const { width, height } = Dimensions.get("window");

interface mediaListProps {
  title: string;
  data: any[];
}

export default function MediaList({ title, data }: mediaListProps) {
  let movieName = "Captain Marvel";
  return (
    <View className="mb-8 space-y-4">
      <View className="mx-4 flex-row justify-between items-center">
        <Text className="text-white text-lg">{title}</Text>
        <TouchableOpacity>
          <Text style={styles.text} className="text-lg">
            See All
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 15 }}
      >
        {data.map((item, index) => {
          return (
            <TouchableWithoutFeedback
              key={index}
              onPress={() =>
                router.push({
                  pathname: "/media",
                  params: { item },
                })
              }
            >
              <View className="space-y-1 mr-4">
                <Image
                  source={require("../../assets/images/moviePoster1.png")}
                  className="rounded-3xl"
                  style={{ width: width * 0.33, height: height * 0.22 }}
                />
                <Text className="text-neutral-300 ml-1">
                  {movieName.length > 14
                    ? item.title.slice(0, 14) + "..."
                    : movieName}
                </Text>
              </View>
            </TouchableWithoutFeedback>
          );
        })}
      </ScrollView>
    </View>
  );
}
