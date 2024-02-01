import {
  View,
  SafeAreaView,
  Text,
  StatusBar,
  TouchableOpacity,
  Platform,
  ScrollView,
  Switch,
} from "react-native";
import React, { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";
import { AntDesign, Entypo, MaterialIcons } from "@expo/vector-icons";
import {
  EmbeddedVideo,
  EpisodeSection,
  MediaActions,
  MediaGrid,
} from "@/src/components";
import {
  embedTvShowUrl,
  fetchRecommendedTVorMovies,
  fetchSimilarTVorMovies,
  fetchTVorMovieDetailsByID,
  fetchTvEpisodeDetails,
} from "@/api/media";
import { MediaData } from "@/assets/types";
import { LinearGradient } from "expo-linear-gradient";

const ios = Platform.OS === "ios";

export default function Watch() {
  const { mediaId, season, episode } = useLocalSearchParams<{
    mediaId: string;
    season: string;
    episode: string;
  }>();
  const [show, setShow] = useState<MediaData | null>(null);
  const [recommendedShows, setRecommendedShows] = useState([]);
  const [similarShows, setSimilarShows] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(Number(season));
  const [episodesData, setEpisodesData] = useState();
  const [showOverview, setShowOverview] = useState(false);

  useEffect(() => {
    getShowDetails(mediaId);
    getRecommendedShows(mediaId);
    getSimilarShows(mediaId);
  }, [mediaId]);

  useEffect(() => {
    getEpisodesDetail(mediaId, selectedSeason.toString());
  }, [mediaId, selectedSeason]);

  const getShowDetails = async (id: string) => {
    const data = await fetchTVorMovieDetailsByID("tv", id);
    if (data) {
      setShow({ ...show, ...data });
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

  const getEpisodesDetail = async (id: string, season_number: string) => {
    const data = await fetchTvEpisodeDetails(id, season_number);
    if (data) {
      setEpisodesData(data);
    }
  };

  const currentEpisodeData = (episodesData as any)?.episodes?.find(
    (ep: { episode_number: number }) => ep.episode_number === parseInt(episode)
  );

  return (
    <LinearGradient colors={["#000", "#011", "#121"]} className="flex-1">
      <StatusBar backgroundColor="black" />
      <SafeAreaView className={`${ios ? "-mb-2" : "mb-3"}`}>
        <SafeAreaView className="absolute z-20 left-2 top-6">
          <TouchableOpacity
            onPress={() => router.push(`/streamtv/${mediaId}`)}
            className="p-2"
          >
            <MaterialIcons name="keyboard-backspace" size={28} color="white" />
          </TouchableOpacity>
        </SafeAreaView>
        <View className="mt-7">
          <EmbeddedVideo
            embedURL={`${embedTvShowUrl}${mediaId}-${season}-${episode}`}
          />
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-white text-base font-semibold mx-3 mt-1">
                {show?.name}
              </Text>
              <Text className="text-neutral-400 font-medium text-sm mx-3">
                {episodesData &&
                  `S${selectedSeason} E${episode} ${currentEpisodeData?.name}`}
              </Text>
            </View>
            <Entypo
              onPress={() => setShowOverview(!showOverview)}
              name={showOverview ? "chevron-thin-up" : "chevron-thin-down"}
              size={20}
              color="#aeaeae"
              style={{ paddingEnd: 10 }}
            />
          </View>
          {showOverview && (
            <Text className="px-3 pt-2 text-neutral-400 text-justify text-xs pb-2">
              {currentEpisodeData?.overview}
            </Text>
          )}
        </View>
      </SafeAreaView>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 10 }}
      >
        <MediaActions
          shareLink={`https://muvotv.vercel.app/shows/${mediaId}/${season}/${episode}`}
          mediaId={mediaId}
          mediaType="tv"
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="border-b border-zinc-800 my-2"
        >
          {show?.seasons
            ?.filter((season: any) => season.name !== "Specials")
            .map((season: any, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setSelectedSeason(season.season_number)}
                className={`mx-3 ${
                  selectedSeason === season.season_number
                    ? "border-b-[1px] border-[#8DC53E]"
                    : ""
                }`}
              >
                <Text
                  className={`${
                    selectedSeason === season.season_number
                      ? "text-white"
                      : "text-neutral-500"
                  } pb-2`}
                >
                  {season.name}
                </Text>
              </TouchableOpacity>
            ))}
        </ScrollView>
        <EpisodeSection episodesData={episodesData} mediaId={mediaId} />
        {recommendedShows.length > 0 && (
          <MediaGrid
            title={"Recommended"}
            data={recommendedShows.slice(0, 6)}
          />
        )}
        {similarShows.length > 0 && (
          <MediaGrid title={"More Like This"} data={similarShows.slice(0, 6)} />
        )}
      </ScrollView>
    </LinearGradient>
  );
}
