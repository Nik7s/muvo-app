import { router } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  Platform,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Bars3CenterLeftIcon,
  MagnifyingGlassIcon,
} from "react-native-heroicons/outline";
import { SafeAreaView } from "react-native-safe-area-context";
import { TrendingMedias, MediaList } from "../../components/index";

const ios = Platform.OS === "ios";

export default function TvShowScreen() {
  const [trending, setTrending] = useState([1, 2, 3, 4, 5]);
  const [popularShows, setPopularShows] = useState([1, 2, 3, 4, 5]);
  const [topRatedShows, setTopRatedShows] = useState([1, 2, 3, 4, 5]);
  return (
    <View className="flex-1 bg-zinc-900 pb-5">
      {/* search bar */}
      <SafeAreaView className={ios ? "-mb-2" : "mb-3"}>
        <StatusBar />
        <View className="flex-row justify-between items-center mx-4 my-2">
          <Bars3CenterLeftIcon size="32" strokeWidth={2} color="white" />
          <View className="flex-1 items-center justify-center">
            <Image
              className="flex-1 w-36"
              source={require("../../../assets/images/logo.png")}
            />
          </View>
          <TouchableOpacity onPress={() => router.replace("/search")}>
            <MagnifyingGlassIcon size="30" strokeWidth={2} color="white" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 10 }}
      >
        {trending.length > 0 && <TrendingMedias data={trending} />}

        {popularShows.length > 0 && (
          <MediaList title="Popular Tv Shows" data={popularShows} />
        )}
        {topRatedShows.length > 0 && (
          <MediaList title="Top Rated Shows" data={topRatedShows} />
        )}
      </ScrollView>
    </View>
  );
}
