import {
  View,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { ChevronLeftIcon } from "react-native-heroicons/outline";
import { HeartIcon, PlayIcon } from "react-native-heroicons/solid";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Cast, Loading, MediaList } from "@/src/components";
import {
  fallbackMoviePoster,
  fetchTVorMovieCreditsByID,
  fetchTVorMovieDetailsByID,
  fetchRecommendedTVorMovies,
  fetchSimilarTVorMovies,
  image500,
} from "../../../../api/mediaDB";
import { styles, theme } from "../../../theme/index";
import { MediaData } from "@/assets/types";

const ios = Platform.OS == "ios";
const topMargin = ios ? "" : " mt-3";
var { width, height } = Dimensions.get("window");

export default function MovieScreen() {
  const { mediaId } = useLocalSearchParams<{ mediaId: string }>();
  const [movie, setMovie] = useState<MediaData | null>(null);
  const [cast, setCast] = useState([]);
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [isFavourite, toggleFavourite] = useState(false);
  const [loading, setLoading] = useState(false);
  const isComingSoon = new Date(movie?.release_date ?? "") > new Date();

  useEffect(() => {
    setLoading(true);
    getMovieDetails(mediaId);
    getMovieCredits(mediaId);
    getRecommendedMovies(mediaId);
    getSimilarMovies(mediaId);
  }, [mediaId]);

  const getMovieDetails = async (id: string) => {
    const data = await fetchTVorMovieDetailsByID("movie", id);
    setLoading(false);
    if (data) {
      setMovie({ ...movie, ...data });
    }
  };
  const getMovieCredits = async (id: string) => {
    const data = await fetchTVorMovieCreditsByID("movie", id);
    if (data && data.cast) {
      setCast(data.cast);
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
    <ScrollView
      contentContainerStyle={{ paddingBottom: 20 }}
      className="flex-1 bg-neutral-900"
    >
      {/* back button and movie poster */}
      <View className="w-full">
        <SafeAreaView
          className={
            "absolute z-20 w-full flex-row justify-between items-center px-4 " +
            topMargin
          }
        >
          <TouchableOpacity
            style={styles.background}
            className="rounded-xl p-1"
            onPress={() => router.back()}
          >
            <ChevronLeftIcon size="28" strokeWidth={2.5} color="white" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => toggleFavourite(!isFavourite)}>
            <HeartIcon
              size="35"
              color={isFavourite ? theme.background : "white"}
            />
          </TouchableOpacity>
        </SafeAreaView>
        {loading ? (
          <Loading />
        ) : (
          <View>
            <Image
              source={{
                //@ts-ignore
                uri: image500(movie?.poster_path) || fallbackMoviePoster,
              }}
              style={{ width, height: height * 0.55 }}
            />
            <LinearGradient
              colors={[
                "transparent",
                "rgba(23, 23, 23, 0.8)",
                "rgba(23, 23, 23, 1)",
              ]}
              style={{ width, height: height * 0.35 }}
              className="absolute bottom-0"
            />
          </View>
        )}
      </View>

      <View style={{ marginTop: -(height * 0.12) }} className="space-y-3">
        {/* title */}
        <Text className="text-white text-center text-3xl font-bold tracking-widest">
          {movie?.title}
        </Text>
        {movie?.id ? (
          <View>
            <Text className="text-neutral-400 font-semibold text-base text-center">
              {movie?.release_date?.split("-")[0] || "N/A"} |{" "}
              {`${Math.floor(Number(movie?.runtime) / 60)}h ${
                Number(movie?.runtime) % 60
              }min`}{" "}
              |{" "}
              <Text className="text-indigo-500 text-center">
                {movie?.genres.map((genre) => genre.name).join(", ")}
              </Text>
            </Text>
            <View className="flex-row justify-evenly my-4">
              {!isComingSoon ? (
                <Button
                  onClick={() => router.push(`/streammovie/${mediaId}/watch`)}
                  label="Watch Now"
                  icon={<PlayIcon size="20" color="black" />}
                />
              ) : (
                <Button
                  label="Coming Soon"
                  disabled={true}
                  icon={<PlayIcon size="20" color="black" />}
                />
              )}
              <Button
                onClick={() => {}}
                label="Play Trailer"
                icon={<PlayIcon size="20" color="black" />}
              />
            </View>
          </View>
        ) : null}
        <Text className="text-neutral-400 mx-4 tracking-wide text-center">
          {movie?.overview}
        </Text>
      </View>
      {movie?.id && cast.length > 0 && <Cast cast={cast} />}
      {movie?.id && recommendedMovies.length > 0 && (
        <MediaList
          title={"Recommended Movies"}
          data={recommendedMovies}
          hideSeeAll={true}
          mediaType="movie"
        />
      )}

      {movie?.id && similarMovies.length > 0 && (
        <MediaList
          title={"Similar Movies"}
          data={similarMovies}
          hideSeeAll={true}
          mediaType="movie"
        />
      )}
    </ScrollView>
  );
}
