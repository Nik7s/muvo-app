import { baseUrl, fallbackThumbnailImage } from "@/api/media";
import { Episode } from "@/assets/types";
import { router } from "expo-router";
import React from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";

interface EpisodeSectionProps {
  episodesData: any;
  mediaId: string;
}

export default function EpisodeSection({
  episodesData,
  mediaId,
}: EpisodeSectionProps) {
  return (
    <ScrollView className="px-3">
      {episodesData?.episodes
        ?.filter((episode: Episode) => {
          return new Date(episode.air_date) < new Date();
        })
        .map((episode: Episode) => (
          <TouchableOpacity
            key={episode.id}
            onPress={() => {
              router.push(
                `/streamtv/${mediaId}/${episode.season_number}/${episode.episode_number}/watch`
              );
            }}
            className="flex-1 my-1"
          >
            <View className="flex-row my-1 space-x-4">
              <Image
                source={{
                  uri: episode.still_path
                    ? `${baseUrl}${episode.still_path}`
                    : fallbackThumbnailImage,
                }}
                alt={`Episode ${episode.episode_number}`}
                className="aspect-video rounded-md w-28"
              />
              <View className="flex-1 items-start justify-center space-y-1">
                <Text className="text-white text-base">{episode.name}</Text>
                <Text className="text-neutral-400 text-xs text-center">
                  {`S${episode.season_number}`}
                  {`E${episode.episode_number} `} •{"  "}
                  {new Date(episode.air_date).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                  {"  "}• {` ${episode.runtime}`}m
                </Text>
              </View>
            </View>
            <Text
              numberOfLines={3}
              className="text-xs font-light leading-3 text-justify text-neutral-400"
            >
              {episode.overview}
            </Text>
          </TouchableOpacity>
        ))}
    </ScrollView>
  );
}
