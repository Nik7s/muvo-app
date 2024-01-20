import {
  View,
  Text,
  Image,
  TouchableWithoutFeedback,
  Dimensions,
} from "react-native";
import React from "react";
import Carousel from "react-native-snap-carousel";
import { router } from "expo-router";
import { fallbackMoviePoster, image500 } from "../../api/mediaDB";
import { MediaData } from "@/assets/types";
import { Feather } from "@expo/vector-icons";

var { width, height } = Dimensions.get("window");

interface TrendingMediasProps {
  data: MediaData[];
  mediaType: string;
}

interface MediaCardProps {
  item: MediaData;
  mediaType: string;
}

const MediaCard: React.FC<MediaCardProps> = ({ item, mediaType }) => {
  const handlePress = () => {
    const route =
      mediaType === "tv" ? `/streamtv/${item.id}` : `/streammovie/${item.id}`;
    router.navigate(route);
  };
  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <Image
        source={{ uri: image500(item.poster_path) || fallbackMoviePoster }}
        style={{
          width: width * 0.6,
          height: height * 0.4,
        }}
        className="rounded-2xl"
      />
    </TouchableWithoutFeedback>
  );
};

export default function TrendingMedias({
  data,
  mediaType,
}: TrendingMediasProps) {
  return (
    <View className="mb-8">
      <Text className="text-white text-xl mx-4 mb-5">
        <Text>Trending Now </Text>
        <Feather name="trending-up" size={24} color="white" />
      </Text>
      <Carousel
        data={data}
        renderItem={({ item }) => (
          <MediaCard item={item} mediaType={mediaType} />
        )}
        firstItem={1}
        autoplay
        autoplayInterval={5000}
        loop
        inactiveSlideOpacity={0.6}
        sliderWidth={width}
        itemWidth={width * 0.62}
        slideStyle={{ display: "flex", alignItems: "center" }}
      />
    </View>
  );
}
