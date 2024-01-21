import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  Platform,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TrendingMedias, MediaList, Loading } from "@/src/components";
import {
  fetchPopularMedias,
  fetchTopRatedMedias,
  fetchTrendingMedias,
} from "@/api/mediaDB";
import { Feather, Octicons } from "@expo/vector-icons";

const ios = Platform.OS === "ios";

export default function MovieScreen() {
  const [trending, setTrending] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getTrendingMedias();
    getPopularMovies();
    getTopRatedMovies();
  }, []);

  const getTrendingMedias = async () => {
    const data = await fetchTrendingMedias("movie");
    if (data && data.results) setTrending(data.results.slice(0, 10));
    setLoading(false);
  };
  const getPopularMovies = async () => {
    const data = await fetchPopularMedias("movie");
    if (data && data.results) setPopularMovies(data.results);
  };
  const getTopRatedMovies = async () => {
    const data = await fetchTopRatedMedias("movie");
    if (data && data.results) setTopRatedMovies(data.results);
  };

  return (
    <View className="flex-1 bg-zinc-900">
      {/* search bar */}
      <SafeAreaView className={ios ? "-mb-2" : "mb-3"}>
        <StatusBar />
        <View className="flex-row justify-between items-center mx-4 my-2">
          <Octicons name="three-bars" size={30} color="white" />
          <View className="flex-1 items-center justify-center">
            <Image
              className="flex-1 w-36"
              source={require("../../../assets/images/logo.png")}
            />
          </View>
          <TouchableOpacity onPress={() => router.replace("/search")}>
            <Feather name="search" size={30} color="white" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {loading ? (
        <Loading />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 30 }}
        >
          {trending.length > 0 && (
            <TrendingMedias data={trending} mediaType="movie" />
          )}

          {popularMovies.length > 0 && (
            <MediaList
              title="Popular Movies"
              data={popularMovies}
              mediaType="movie"
              hideSeeAll={false}
            />
          )}
          {topRatedMovies.length > 0 && (
            <MediaList
              title="Top Rated Movies"
              data={topRatedMovies}
              mediaType="movie"
              hideSeeAll={false}
            />
          )}
        </ScrollView>
      )}
    </View>
  );
}
