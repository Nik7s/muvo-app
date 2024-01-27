import React, { useEffect } from "react";
import { MediaGrid } from "../components";
import { useGlobal } from "../context/global";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "expo-router";

export default function seeAll() {
  const { seeAllData } = useGlobal();
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      title: seeAllData.title,
    });
  }, [navigation, seeAllData.title]);

  return (
    <LinearGradient colors={["#000", "#011", "#121"]} className="flex-1">
      <MediaGrid data={seeAllData.data} mediaType={seeAllData.mediaType} />
    </LinearGradient>
  );
}
