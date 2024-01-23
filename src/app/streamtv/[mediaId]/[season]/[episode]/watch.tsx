import {
  View,
  SafeAreaView,
  Text,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";
import { MaterialIcons } from "@expo/vector-icons";
import { EmbeddedVideo } from "@/src/components";
import { embedTvShowUrl, fetchTVorMovieDetailsByID } from "@/api/mediaDB";
import { MediaData } from "@/assets/types";

export default function watch() {
  const { mediaId, season, episode } = useLocalSearchParams<{
    mediaId: string;
    season: string;
    episode: string;
  }>();
  const [show, setShow] = useState<MediaData | null>(null);

  useEffect(() => {
    getShowDetails(mediaId);
    async function setOrientation() {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.LANDSCAPE
      );
    }
    setOrientation();
    return () => {
      ScreenOrientation.unlockAsync();
    };
  }, [mediaId]);

  const getShowDetails = async (id: string) => {
    const data = await fetchTVorMovieDetailsByID("tv", id);
    if (data) {
      setShow({ ...show, ...data });
    }
  };

  return (
    <View className="flex-1 bg-zinc-900">
      <SafeAreaView className="flex-row items-center ml-7 z-20">
        <StatusBar hidden />
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="keyboard-backspace" size={26} color="#eaeaea" />
        </TouchableOpacity>
        <View className="flex-row items-center space-x-2 ml-3">
          <Text className="text-neutral-300">{show?.name}</Text>
          <Text className="text-neutral-400">
            {`S${season}`}
            {`E${episode}`}
          </Text>
        </View>
      </SafeAreaView>
      <View className="absolute w-full">
        <EmbeddedVideo
          embedURL={`${embedTvShowUrl}${mediaId}&s=${season}&e=${episode}`}
        />
      </View>
    </View>
  );
}
