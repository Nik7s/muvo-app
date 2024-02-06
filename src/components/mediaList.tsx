import {
  View,
  Text,
  TouchableWithoutFeedback,
  Image,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { FlashList } from "@shopify/flash-list";
import React from "react";
import { styles } from "../theme";
import { useRouter } from "expo-router";
import { fallbackMoviePoster, image342 } from "@/api/media";
const { width, height } = Dimensions.get("window");
import MarqueeView from "react-native-marquee-view";
import { MediaData } from "@/assets/types";
import { useGlobal } from "../context/global";
interface MediaListProps {
  title: string;
  data: any[];
  mediaType: string;
  hideSeeAll: boolean;
}

const MediaList: React.FC<MediaListProps> = ({
  title,
  data,
  mediaType,
  hideSeeAll,
}) => {
  const { setSeeAll } = useGlobal();
  const router = useRouter();

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
            uri: image342(item.poster_path) || fallbackMoviePoster,
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

  const handleSeeAll = () => {
    setSeeAll(title, data, mediaType);
    router.push(`/seeAll`);
  };

  return (
    <View className="mb-6 space-y-4">
      <View className="m-3 flex-row justify-between items-center">
        <Text className="font-semibold text-xl text-white">{title}</Text>
        {!hideSeeAll && (
          <TouchableOpacity onPress={handleSeeAll}>
            <Text style={styles.text} className="text-lg">
              See All
            </Text>
          </TouchableOpacity>
        )}
      </View>
      <FlashList
        horizontal
        removeClippedSubviews
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        data={data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        estimatedItemSize={140}
      />
    </View>
  );
};

export default React.memo(MediaList);
