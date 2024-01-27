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
import { embedMovieUrl, fetchTVorMovieDetailsByID } from "@/api/media";
import { MediaData } from "@/assets/types";

export default function Watch() {
  const { mediaId } = useLocalSearchParams<{ mediaId: string }>();
  const [movie, setMovie] = useState<MediaData | null>(null);

  useEffect(() => {
    getMovieDetails(mediaId);
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

  const getMovieDetails = async (id: string) => {
    const data = await fetchTVorMovieDetailsByID("movie", id);
    if (data) {
      setMovie({ ...movie, ...data });
    }
  };

  return (
    <View className="flex-1 bg-zinc-900">
      <SafeAreaView className="flex-row items-center ml-4 mt-3 z-20">
        <StatusBar hidden />
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="keyboard-backspace" size={26} color="#eaeaea" />
        </TouchableOpacity>
        <Text className="text-neutral-300 ml-3">{movie?.title}</Text>
      </SafeAreaView>
      <View className="absolute w-full">
        <EmbeddedVideo embedURL={`${embedMovieUrl}${mediaId}`} />
      </View>
    </View>
  );
}
