import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { Feather, Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Button,
  Cast,
  Loading,
  MediaActions,
  MediaList,
  VideoSection,
  VideoTrailer,
} from "@/src/components";
import {
  fetchTVorMovieCreditsByID,
  fetchTVorMovieDetailsByID,
  fetchRecommendedTVorMovies,
  fetchSimilarTVorMovies,
  image500,
  fetchTVorMovieVideosByID,
  fetchTvContentRatingByID,
  baseUrl,
} from "../../../../api/mediaDB";
import { MediaData, VideoDataItem } from "@/assets/types";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const ios = Platform.OS == "ios";
const Ymargin = ios ? "" : " mt-1";
var { width, height } = Dimensions.get("window");

export default function ShowsScreen() {
  const { mediaId } = useLocalSearchParams<{ mediaId: string }>();
  const [show, setShow] = useState<MediaData | null>(null);
  const [cast, setCast] = useState([]);
  const [recommendedShows, setRecommendedShows] = useState([]);
  const [similarShows, setSimilarShows] = useState([]);
  const [videosData, setVideosData] = useState<VideoDataItem[]>([]);
  const [contentRating, setContentRating] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const isComingSoon = new Date(show?.first_air_date ?? "") > new Date();
  const scrollViewRef = useRef<ScrollView | null>(null);

  useEffect(() => {
    setLoading(true);
    getShowDetails(mediaId);
    getShowCredits(mediaId);
    getContentRating(mediaId);
    getRecommendedShows(mediaId);
    getSimilarShows(mediaId);
    getVideosData(mediaId);
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 0, animated: false });
    }
  }, [mediaId]);

  const getShowDetails = async (id: string) => {
    const data = await fetchTVorMovieDetailsByID("tv", id);
    setLoading(false);
    if (data) {
      setShow({ ...show, ...data });
    }
  };

  const getShowCredits = async (id: string) => {
    const data = await fetchTVorMovieCreditsByID("tv", id);
    if (data && data.cast) {
      setCast(data.cast);
    }
  };

  const getVideosData = async (id: string) => {
    const data = await fetchTVorMovieVideosByID("tv", id);
    if (data && data.results) {
      setVideosData(data.results);
    }
  };

  const getRecommendedShows = async (id: string) => {
    const data = await fetchRecommendedTVorMovies("tv", id);
    if (data && data.results) {
      setRecommendedShows(data.results);
    }
  };

  const getSimilarShows = async (id: string) => {
    const data = await fetchSimilarTVorMovies("tv", id);
    if (data && data.results) {
      setSimilarShows(data.results);
    }
  };

  const getContentRating = async (id: string) => {
    const data = await fetchTvContentRatingByID(id);
    if (data && data.results) {
      const rating =
        data.results.find((date: { iso_3166_1: string; rating: string }) =>
          ["IN", "US"].some(
            (country) => date.iso_3166_1 === country && date.rating !== ""
          )
        ) ||
        data.results.find((date: { rating: string }) => date.rating !== "");

      setContentRating(rating?.rating);
    }
  };

  return (
    <View className="flex-1">
      <SafeAreaView className="absolute z-20 w-full flex-row-reverse px-5 py-2">
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="x" size={24} color="white" />
        </TouchableOpacity>
      </SafeAreaView>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={{ paddingBottom: 20 }}
        className="flex-1 bg-zinc-900"
      >
        {/* back button and showposter */}
        <View className="w-full">
          {loading ? (
            <Loading />
          ) : (
            <VideoTrailer
              videoId={
                videosData.find((video) => video.type === "Trailer")?.key
              }
              thumbnailUrl={`${baseUrl}${
                show?.backdrop_path || show?.poster_path
              }`}
              playerHeight={210}
              outerViewClasses="mt-8 mx-2.5 overflow-hidden rounded-xl"
              controlsEnabled={false}
              isOverlay={true}
            />
          )}
        </View>

        <View className="space-y-3">
          <View className="mt-4">
            <Text className="text-white text-center text-5xl font-extralight tracking-widest">
              {show?.name}
            </Text>
            <Text className="text-neutral-300 text-center italic font-extralight">
              {show?.tagline}
            </Text>
          </View>
          {show?.id ? (
            <View>
              <Text className="text-neutral-400 font-semibold text-base text-center">
                {show?.first_air_date?.split("-")[0] || "N/A"} •{" "}
                {`${show?.number_of_seasons} Seasons`} • {contentRating}
              </Text>
              <View className="w-full my-4">
                {!isComingSoon ? (
                  <Button
                    onClick={() =>
                      router.push(`/streamtv/${mediaId}/1/1/watch`)
                    }
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
                {show?.genres.map((genre, index) => (
                  <View
                    key={genre.name}
                    style={{ flexDirection: "row", alignItems: "center" }}
                  >
                    <Text className="text-indigo-600">{genre.name}</Text>
                    {index < show.genres.length - 1 && (
                      <Text className="text-indigo-400 mx-1">|</Text>
                    )}
                  </View>
                ))}
              </View>
              <Text className="text-neutral-400 mx-4 tracking-wide text-center">
                {show?.overview}
              </Text>
              <MediaActions
                shareLink={`https://muvotv.vercel.app/shows/${mediaId}`}
              />
            </View>
          ) : null}
        </View>
        {show?.id && cast.length > 0 && <Cast cast={cast} />}
        {show?.id && recommendedShows.length > 0 && (
          <MediaList
            title={"Recommended Tv Shows"}
            data={recommendedShows}
            hideSeeAll={true}
            mediaType="tv"
          />
        )}

        {show?.id && similarShows.length > 0 && (
          <MediaList
            title={"Similar Tv Shows"}
            data={similarShows}
            hideSeeAll={true}
            mediaType="tv"
          />
        )}

        {show?.id && videosData.length > 0 && (
          <VideoSection
            videosData={videosData}
            title="Trailers & more"
            mediaId={mediaId}
            mediaType="tv"
          />
        )}
      </ScrollView>
    </View>
  );
}
