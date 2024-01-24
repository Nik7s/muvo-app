import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  TouchableWithoutFeedback,
  Dimensions,
} from "react-native";
import React, { useCallback, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { debounce } from "lodash";
import { router } from "expo-router";
import { Loading } from "@/src/components";
import {
  fallbackMoviePoster,
  image185,
  fetchTVorMovieSearchResults,
} from "@/api/media";
import { MediaData } from "@/assets/types";
import MarqueeView from "react-native-marquee-view";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");

export default function SearchScreen() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<MediaData[]>([]);

  const handleSearch = async (query: string) => {
    try {
      if (query && query.length > 2) {
        setLoading(true);
        const [tvData, movieData] = await Promise.all([
          fetchTVorMovieSearchResults("tv", query),
          fetchTVorMovieSearchResults("movie", query),
        ]);
        setLoading(false);
        const resultsAll = [
          ...(tvData?.results || []).map((result: any) => ({
            ...result,
            mediaType: "tv",
          })),
          ...(movieData?.results || []).map((result: any) => ({
            ...result,
            mediaType: "movie",
          })),
        ];
        setResults(resultsAll);
      } else {
        setLoading(false);
        setResults([]);
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
      setLoading(false);
    }
  };

  const handleTextDebounce = useCallback(debounce(handleSearch, 300), []);

  return (
    <LinearGradient colors={["#000", "#011", "#121"]} className="flex-1">
      <SafeAreaView className="flex-1">
        {/* search input */}
        <View className="mx-4 my-3 flex-row justify-between items-center border border-zinc-700 rounded-full">
          <TextInput
            onChangeText={handleTextDebounce}
            placeholder="Search Movies, TV and Dramas..."
            placeholderTextColor={"lightgray"}
            className="pb-1 pl-6 flex-1 text-base font-semibold text-white tracking-wider"
          />
          <TouchableOpacity
            onPress={() => router.navigate("/")}
            className="rounded-full p-3 m-1 bg-zinc-700"
          >
            <Feather name="x" size={24} color="white" />
          </TouchableOpacity>
        </View>
        {loading ? (
          <Loading />
        ) : results.length > 0 ? (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 15 }}
            className="space-y-3"
          >
            <Text className="text-white font-semibold ml-1">
              Results ({results.length})
            </Text>
            <View className="flex-row justify-between flex-wrap">
              {results.map((result) => {
                const route =
                  result.mediaType === "tv"
                    ? `/streamtv/${result.id}`
                    : `/streammovie/${result.id}`;
                return (
                  <TouchableWithoutFeedback
                    key={result.id}
                    onPress={() => router.navigate(route)}
                  >
                    <View className="space-y-2 mb-4">
                      <Image
                        source={{
                          uri:
                            image185(result?.poster_path) ||
                            fallbackMoviePoster,
                        }}
                        className="rounded-2xl"
                        style={{ width: width * 0.44, height: height * 0.3 }}
                      />
                      {(result.name || result.title).length > 22 ? (
                        <MarqueeView style={{ width: 180 }}>
                          <Text className="text-neutral-300 ml-1">
                            {result.name || result.title}
                          </Text>
                        </MarqueeView>
                      ) : (
                        <Text className="text-neutral-300 ml-1">
                          {result.name || result.title}
                        </Text>
                      )}
                    </View>
                  </TouchableWithoutFeedback>
                );
              })}
            </View>
          </ScrollView>
        ) : (
          <View className="flex-row justify-center">
            <Image
              source={require("../../assets/images/movieTime.png")}
              className="h-96 w-96"
            />
          </View>
        )}
      </SafeAreaView>
    </LinearGradient>
  );
}
