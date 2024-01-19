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
import {
  Bars3CenterLeftIcon,
  MagnifyingGlassIcon,
} from "react-native-heroicons/outline";
import { SafeAreaView } from "react-native-safe-area-context";
import { TrendingMedias, MediaList, Loading } from "@/src/components";
import {
  fetchTrendingMedias,
  fetchPopularMedias,
  fetchTopRatedMedias,
} from "../../../api/mediaDB";

const ios = Platform.OS === "ios";

export default function HomeScreen() {
  const [trending, setTrending] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [popularShows, setPopularShows] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [topRatedShows, setTopRatedShows] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getTrendingMedias();
    getPopularMovies();
    getPopularShows();
    getTopRatedMovies();
    getTopRatedShows();
  }, []);

  const getTrendingMedias = async () => {
    const data = await fetchTrendingMedias("movie");
    if (data && data.results) setTrending(data.results);
    setLoading(false);
  };
  const getPopularMovies = async () => {
    const data = await fetchPopularMedias("movie");
    if (data && data.results) setPopularMovies(data.results);
  };
  const getPopularShows = async () => {
    const data = await fetchPopularMedias("tv");
    if (data && data.results) setPopularShows(data.results);
  };
  const getTopRatedMovies = async () => {
    const data = await fetchTopRatedMedias("movie");
    if (data && data.results) setTopRatedMovies(data.results);
  };
  const getTopRatedShows = async () => {
    const data = await fetchTopRatedMedias("tv");
    if (data && data.results) setTopRatedShows(data.results);
  };

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

      {loading ? (
        <Loading />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 10 }}
        >
          {trending.length > 0 && (
            <TrendingMedias data={trending} mediaType="movie" />
          )}

          {popularMovies.length > 0 && (
            <MediaList
              title="Popular Movies"
              data={popularMovies}
              mediaType="movie"
            />
          )}
          {popularShows.length > 0 && (
            <MediaList
              title="Popular Tv Shows"
              data={popularShows}
              mediaType="tv"
            />
          )}
          {topRatedMovies.length > 0 && (
            <MediaList
              title="Top Rated Movies"
              data={topRatedMovies}
              mediaType="movie"
            />
          )}
          {topRatedShows.length > 0 && (
            <MediaList
              title="Top Rated Shows"
              data={topRatedShows}
              mediaType="tv"
            />
          )}
        </ScrollView>
      )}
    </View>
  );
}
