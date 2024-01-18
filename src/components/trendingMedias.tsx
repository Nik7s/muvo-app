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
import { ArrowTrendingUpIcon } from "react-native-heroicons/outline";

var { width, height } = Dimensions.get("window");

interface TrendingMoviesProps {
  data: any[];
}

interface MovieCardProps {
  item: any;
  handleClick: (item: any) => void;
}

const MediaCard: React.FC<MovieCardProps> = ({ item, handleClick }) => {
  return (
    <TouchableWithoutFeedback onPress={() => handleClick(item)}>
      <Image
        source={require("../../assets/images/moviePoster2.png")}
        style={{
          width: width * 0.6,
          height: height * 0.4,
        }}
        className="rounded-2xl"
      />
    </TouchableWithoutFeedback>
  );
};

export default function TrendingMedias({ data }: TrendingMoviesProps) {
  const handleClick = (item: any) => {
    router.push({
      pathname: "/media",
      params: { item },
    });
  };
  return (
    <View className="mb-8">
      <Text className="text-white text-xl mx-4 mb-5">
        <Text>Trending Now </Text>
        <ArrowTrendingUpIcon size="24" strokeWidth={1.5} color="white" />
      </Text>
      <Carousel
        data={data}
        renderItem={({ item }) => (
          <MediaCard item={item} handleClick={handleClick} />
        )}
        firstItem={1}
        inactiveSlideOpacity={0.6}
        sliderWidth={width}
        itemWidth={width * 0.62}
        slideStyle={{ display: "flex", alignItems: "center" }}
      />
    </View>
  );
}
