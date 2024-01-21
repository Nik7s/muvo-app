import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Button,
  Cast,
  Loading,
  MediaActions,
  MediaList,
  VideoTrailer,
} from "@/src/components";
import {
  fetchTVorMovieCreditsByID,
  fetchTVorMovieDetailsByID,
  fetchRecommendedTVorMovies,
  fetchSimilarTVorMovies,
  fetchTVorMovieVideosByID,
  fetchMovieContentRatingByID,
} from "../../../../api/mediaDB";
import { MediaData } from "@/assets/types";

export default function MovieScreen() {
  const { mediaId } = useLocalSearchParams<{ mediaId: string }>();
  const [movie, setMovie] = useState<MediaData | null>(null);
  const [cast, setCast] = useState([]);
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [trailerVideoId, setTrailerVideoId] = useState<string>("");
  const [contentRating, setContentRating] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const isComingSoon = new Date(movie?.release_date ?? "") > new Date();

  useEffect(() => {
    setLoading(true);
    getMovieDetails(mediaId);
    getMovieCredits(mediaId);
    getContentRating(mediaId);
    getRecommendedMovies(mediaId);
    getSimilarMovies(mediaId);
    getTrailerVideoId(mediaId);
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

  const getTrailerVideoId = async (id: string) => {
    const data = await fetchTVorMovieVideosByID("movie", id);
    if (data && data.results) {
      const trailer = data.results.find(
        (video: { type: string }) => video.type === "Trailer"
      );
      if (trailer) {
        setTrailerVideoId(trailer.key);
      }
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

  const getContentRating = async (id: string) => {
    const data = await fetchMovieContentRatingByID(id);
    if (data && data.results) {
      const certification =
        data.results.find(
          (date: {
            iso_3166_1: string;
            release_dates: { certification: string }[];
          }) =>
            ["IN", "US"].some(
              (country) =>
                date.iso_3166_1 === country &&
                date.release_dates[0]?.certification !== ""
            )
        ) ||
        data.results.find(
          (date: { release_dates: { certification: string }[] }) =>
            date.release_dates[0]?.certification !== ""
        );
      setContentRating(certification.release_dates[0]?.certification);
    }
  };

  return (
    <View className="flex-1">
      <ScrollView
        contentContainerStyle={{ paddingBottom: 20 }}
        className="flex-1 bg-zinc-900"
      >
        <View className="w-full">
          <SafeAreaView className="absolute z-20 w-full flex-row-reverse px-5 py-2">
            <TouchableOpacity onPress={() => router.back()}>
              <Feather name="x" size={24} color="white" />
            </TouchableOpacity>
          </SafeAreaView>
          {loading ? (
            <Loading />
          ) : (
            <VideoTrailer
              videoId={trailerVideoId}
              thumbnailUrl={movie?.backdrop_path || movie?.poster_path}
            />
          )}
        </View>

        <View className="space-y-3">
          {/* title */}
          <View className="mt-4">
            <Text className="text-white text-center text-5xl font-extralight tracking-widest">
              {movie?.title}
            </Text>
            <Text className="text-neutral-300 text-center italic font-extralight">
              {movie?.tagline}
            </Text>
          </View>
          {movie?.id ? (
            <View>
              <Text className="text-neutral-400 font-medium text-base text-center">
                {movie?.release_date?.split("-")[0] || "N/A"} •{" "}
                {`${Math.floor(Number(movie?.runtime) / 60)}h ${
                  Number(movie?.runtime) % 60
                }min`}{" "}
                • {contentRating}
              </Text>
              <View className="w-full my-4">
                {!isComingSoon ? (
                  <Button
                    onClick={() => router.push(`/streammovie/${mediaId}/watch`)}
                    label="Watch Now"
                    icon={
                      <Ionicons name="play-sharp" size={20} color="black" />
                    }
                  />
                ) : (
                  <Button
                    label="Coming Soon"
                    disabled={true}
                    icon={
                      <MaterialCommunityIcons
                        name="timer-sand"
                        size={20}
                        color="black"
                      />
                    }
                  />
                )}
              </View>
              <View className="flex-row items-center justify-center pb-3">
                {movie?.genres.map((genre, index) => (
                  <View
                    key={genre.name}
                    style={{ flexDirection: "row", alignItems: "center" }}
                  >
                    <Text className="text-indigo-600">{genre.name}</Text>
                    {index < movie.genres.length - 1 && (
                      <Text className="text-indigo-400 mx-1">|</Text>
                    )}
                  </View>
                ))}
              </View>
              <Text className="text-neutral-400 mx-4 tracking-wide text-center">
                {movie?.overview}
              </Text>
              <MediaActions
                shareLink={`https://muvotv.vercel.app/movies/${mediaId}`}
              />
            </View>
          ) : null}
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
    </View>
  );
}
