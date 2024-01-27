import {
  View,
  Text,
  TouchableWithoutFeedback,
  Image,
  Dimensions,
  ScrollView,
} from "react-native";
import React from "react";
import { router } from "expo-router";
import { fallbackMoviePoster, image342 } from "@/api/media";
const { width, height } = Dimensions.get("window");
import { MediaData } from "@/assets/types";
interface MediaGridProps {
  title?: string;
  data: any[];
}

export default function MediaGrid({ title, data }: MediaGridProps) {
  const handlePress = (item: MediaData) => {
    const route =
      item.media_type === "tv"
        ? `/streamtv/${item.id}`
        : `/streammovie/${item.id}`;
    router.navigate(route);
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      className="space-y-3 px-3 py-2"
    >
      {title && (
        <Text className="font-semibold text-xl text-white">{title}</Text>
      )}
      <View className="flex-row justify-between flex-wrap">
        {data.map((item, index) => (
          <TouchableWithoutFeedback
            key={index}
            onPress={() => handlePress(item)}
          >
            <View className="mb-2">
              <Image
                source={{
                  uri: image342(item.poster_path) || fallbackMoviePoster,
                }}
                className="rounded-lg"
                style={{ width: width * 0.3, height: height * 0.22 }}
              />
            </View>
          </TouchableWithoutFeedback>
        ))}
      </View>
    </ScrollView>
  );
}
