import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TrendingMedias, MediaList, Loading } from "@/src/components";
import {
  fetchTrendingMedias,
  fetchPopularMedias,
  fetchTopRatedMedias,
} from "@/api/media";
import { Feather } from "@expo/vector-icons";
import { MediaData } from "@/assets/types";
import { LinearGradient } from "expo-linear-gradient";

const ios = Platform.OS === "ios";

export default function HomeScreen() {
  const [trending, setTrending] = useState<MediaData[]>([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [popularShows, setPopularShows] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [topRatedShows, setTopRatedShows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTrendingMedias();
    getPopularMovies();
    getPopularShows();
    getTopRatedMovies();
    getTopRatedShows();
  }, []);

  const getTrendingMedias = async () => {
    const [tvData, movieData] = await Promise.all([
      fetchTrendingMedias("movie"),
      fetchTrendingMedias("tv"),
    ]);
    const trendingAll = [
      ...tvData?.results.slice(0, 10),
      ...movieData?.results.slice(0, 10),
    ];
    setTrending(trendingAll);
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
    <LinearGradient colors={["#000", "#011", "#121"]} className="flex-1">
      <SafeAreaView className={ios ? "-mb-2" : "mb-3"}>
        <View className="flex-row justify-between items-center mx-4 my-2">
          <View>
            <Image
              className="flex-1 w-32"
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
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          {trending.length > 0 && <TrendingMedias data={trending} />}

          {popularMovies.length > 0 && (
            <MediaList
              title="Popular Movies"
              data={popularMovies}
              mediaType="movie"
              hideSeeAll={false}
            />
          )}
          {popularShows.length > 0 && (
            <MediaList
              title="Popular Tv Shows"
              data={popularShows}
              mediaType="tv"
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
          {topRatedShows.length > 0 && (
            <MediaList
              title="Top Rated Shows"
              data={topRatedShows}
              mediaType="tv"
              hideSeeAll={false}
            />
          )}
        </ScrollView>
      )}
    </LinearGradient>
  );
}
