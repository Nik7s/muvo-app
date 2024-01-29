import {
  View,
  SafeAreaView,
  Text,
  StatusBar,
  TouchableOpacity,
  Platform,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { EmbeddedVideo, MediaGrid } from "@/src/components";
import {
  embedMovieUrl,
  fetchRecommendedTVorMovies,
  fetchSimilarTVorMovies,
  fetchTVorMovieDetailsByID,
} from "@/api/media";
import { MediaData } from "@/assets/types";
import { LinearGradient } from "expo-linear-gradient";

const ios = Platform.OS === "ios";

export default function Watch() {
  const { mediaId } = useLocalSearchParams<{ mediaId: string }>();
  const [movie, setMovie] = useState<MediaData | null>(null);
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const [similarMovies, setSimilarMovies] = useState([]);

  useEffect(() => {
    getMovieDetails(mediaId);
    getRecommendedMovies(mediaId);
    getSimilarMovies(mediaId);
  }, [mediaId]);

  const getMovieDetails = async (id: string) => {
    const data = await fetchTVorMovieDetailsByID("movie", id);
    if (data) {
      setMovie({ ...movie, ...data });
    }
  };

  const getRecommendedMovies = async (id: string) => {
    const data = await fetchRecommendedTVorMovies("movie", id);
    if (data && data.results) {
      setRecommendedMovies(data.results);
    }
  };

  const getSimilarMovies = async (id: string) => {
    const data = await fetchSimilarTVorMovies("movie", id);
    if (data && data.results) {
      setSimilarMovies(data.results);
    }
  };
  return (
    <LinearGradient colors={["#000", "#011", "#121"]} className="flex-1">
      <StatusBar backgroundColor="black" />
      <SafeAreaView className={`${ios ? "-mb-2" : "mb-3"}`}>
        <SafeAreaView className="absolute z-20 left-2 top-6">
          <TouchableOpacity
            onPress={() => router.push(`/streammovie/${mediaId}`)}
            className="p-2"
          >
            <MaterialIcons name="keyboard-backspace" size={28} color="white" />
          </TouchableOpacity>
        </SafeAreaView>
        <View className="mt-7">
          <EmbeddedVideo embedURL={`${embedMovieUrl}${mediaId}`} />
          <Text className="text-white text-base font-semibold mx-3 mt-1">
            {movie?.title}
          </Text>
          <Text className="text-neutral-400 font-medium text-sm mx-3">
            {movie?.release_date?.split("-")[0] || "N/A"} •{" "}
            {`${Math.floor(Number(movie?.runtime) / 60)}h ${
              Number(movie?.runtime) % 60
            }min`}{" "}
            •{" "}
            {movie?.genres.map((genre, index) => (
              <Text key={genre.name} className="text-indigo-600">
                {genre.name}
                {index < movie.genres.length - 1 ? ", " : ""}
              </Text>
            ))}
          </Text>
        </View>
      </SafeAreaView>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 10 }}
      >
        {similarMovies.length > 0 && (
          <MediaGrid
            title={"More Like This"}
            data={similarMovies.slice(0, 6)}
          />
        )}
        {recommendedMovies.length > 0 && (
          <MediaGrid
            title={"Recommended"}
            data={recommendedMovies.slice(0, 6)}
          />
        )}
      </ScrollView>
    </LinearGradient>
  );
}
