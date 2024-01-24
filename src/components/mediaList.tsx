import {
  View,
  Text,
  FlatList,
  TouchableWithoutFeedback,
  Image,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { styles } from "../theme";
import { router } from "expo-router";
import { fallbackMoviePoster, image185 } from "@/api/media";
const { width, height } = Dimensions.get("window");
import MarqueeView from "react-native-marquee-view";
import { MediaData } from "@/assets/types";
interface mediaListProps {
  title: string;
  data: any[];
  mediaType: string;
  hideSeeAll: boolean;
}

export default function MediaList({
  title,
  data,
  mediaType,
  hideSeeAll,
}: mediaListProps) {
  const handlePress = (item: MediaData) => {
    const route =
      mediaType === "tv" ? `/streamtv/${item.id}` : `/streammovie/${item.id}`;
    router.navigate(route);
  };

  const renderItem = ({ item }: { item: MediaData }) => (
    <TouchableWithoutFeedback onPress={() => handlePress(item)}>
      <View className="space-y-1 mr-4">
        <Image
          source={{
            uri: image185(item.poster_path) || fallbackMoviePoster,
          }}
          className="rounded-2xl"
          style={{ width: width * 0.33, height: height * 0.22 }}
        />
        {(item.name || item.title).length > 22 ? (
          <MarqueeView style={{ width: 130 }}>
            <Text className="text-neutral-300 ml-1">
              {item.name || item.title}
            </Text>
          </MarqueeView>
        ) : (
          <Text className="text-neutral-300 ml-1">
            {item.name || item.title}
          </Text>
        )}
      </View>
    </TouchableWithoutFeedback>
  );

  return (
    <View className="mb-8 space-y-4">
      <View className="mx-4 flex-row justify-between items-center">
        <Text className="font-semibold text-xl text-white">{title}</Text>
        {!hideSeeAll && (
          <TouchableOpacity>
            <Text style={styles.text} className="text-lg">
              See All
            </Text>
          </TouchableOpacity>
        )}
      </View>
      <FlatList
        horizontal
        initialNumToRender={3}
        removeClippedSubviews
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        data={data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
      />
    </View>
  );
}
