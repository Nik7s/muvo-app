import React, { useState } from "react";
import { View, TouchableOpacity, Text, Share } from "react-native";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";

interface MediaActionsProps {
  shareLink: string | undefined;
}
const MediaActions: React.FC<MediaActionsProps> = ({ shareLink }) => {
  const [addTowatchlist, setAddToWatchlist] = useState(false);

  const handleAddToWatchlist = () => {
    setAddToWatchlist(!addTowatchlist);
  };

  const handleShare = () => {
    if (shareLink) {
      Share.share({
        message: `${shareLink}`,
      });
    }
  };

  return (
    <View className="flex-row mt-4 mx-6">
      <TouchableOpacity
        className="flex-col items-center py-2 mx-3 rounded-full"
        onPress={handleAddToWatchlist}
      >
        <AntDesign
          name={addTowatchlist ? "check" : "plus"}
          size={24}
          color="white"
        />
        <Text className="text-neutral-400 text-xs">
          {addTowatchlist ? "Added" : "Watchlist"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="flex-col items-center py-1 mx-6 rounded-full"
        onPress={() => handleShare()}
      >
        <MaterialCommunityIcons name="share-outline" size={28} color="white" />
        <Text className="text-neutral-400 text-xs">Share</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MediaActions;
