import {
  View,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { router, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowLeftIcon, ChevronLeftIcon } from "react-native-heroicons/outline";
import { HeartIcon } from "react-native-heroicons/solid";
import { SafeAreaView } from "react-native-safe-area-context";
import { Cast, MediaList } from "@/src/components";
// import { fallbackMoviePoster, fetchTVorMovieCreditsByID, fetchTVorMovieDetailsByID, fetchRecommendedTVorMovies, image500 } from '../../../../api/mediaDB';
import { styles, theme } from "../../../theme/index";

const ios = Platform.OS == "ios";
const topMargin = ios ? "" : " mt-3";
var { width, height } = Dimensions.get("window");

export default function MovieScreen() {
  const { setParams: item } = useRouter();
  const [movie, setMovie] = useState({});
  const [cast, setCast] = useState([]);
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [isFavourite, toggleFavourite] = useState(false);

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
        <View>
          <Image
            source={require("../../../../assets/images/moviePoster1.png")}
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
      </View>

      {/* movie details */}

      <View style={{ marginTop: -(height * 0.12) }} className="space-y-3">
        {/* title */}
        <Text className="text-white text-center text-3xl font-bold tracking-widest">
          Captain Marvel
        </Text>

        {/* status, release year, runtime */}
        <Text className="text-neutral-400 font-semibold text-base text-center flex-row justify-center mx-4 space-x-2">
          2019 • 2h 4min • Released
        </Text>

        <View className="flex-row justify-center mx-4 space-x-2">
          <Text className="text-indigo-500 font-semibold text-base text-center">
            Action • Adventure • Science Fiction
          </Text>
        </View>

        {/* description */}
        <Text className="text-neutral-400 mx-4 tracking-wide text-center">
          The story follows Carol Danvers as she becomes one of the universe’s
          most powerful heroes when Earth is caught in the middle of a galactic
          war between two alien races. Set in the 1990s, Captain Marvel is an
          all-new adventure from a previously unseen period in the history of
          the Marvel Cinematic Universe.
        </Text>
      </View>

      {/* cast */}
      <Cast cast={cast} />

      {/* Recommended movies section */}
      <MediaList
        title={"Recommended Movies"}
        data={recommendedMovies}
        mediaType="movie"
      />
      {/* similar movies section */}
      <MediaList
        title={"Similar Movies"}
        data={similarMovies}
        mediaType="movie"
      />
    </ScrollView>
  );
}
