import { View, Dimensions } from "react-native";
import React from "react";
import * as Progress from "react-native-progress";
import { theme } from "../theme";
const { width, height } = Dimensions.get("window");

const Loading = () => {
  return (
    <View
      style={{ height, width }}
      className="flex-row justify-center items-center min-h-screen"
    >
      <Progress.CircleSnail thickness={4} size={80} color={theme.background} />
    </View>
  );
};

export default Loading;
