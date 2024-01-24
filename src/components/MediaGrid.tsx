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
import { fallbackMoviePoster, image185 } from "@/api/media";
const { width, height } = Dimensions.get("window");
import { MediaData } from "@/assets/types";
interface MediaGridProps {
  title: string;
  data: any[];
  mediaType: string;
}

export default function MediaGrid({ title, data, mediaType }: MediaGridProps) {
  const handlePress = (item: MediaData) => {
    const route =
      mediaType === "tv" ? `/streamtv/${item.id}` : `/streammovie/${item.id}`;
    router.navigate(route);
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} className="space-y-3 p-3">
      <Text className="font-semibold text-xl text-white">{title}</Text>
      <View className="flex-row justify-between flex-wrap">
        {data.map((item, index) => (
          <TouchableWithoutFeedback
            key={index}
            onPress={() => handlePress(item)}
          >
            <View className="mb-2">
              <Image
                source={{
                  uri: image185(item.poster_path) || fallbackMoviePoster,
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
