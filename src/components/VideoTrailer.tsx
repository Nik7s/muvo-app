import React, { useEffect, useRef, useState } from "react";
import { View, TouchableOpacity, Image } from "react-native";
import YoutubePlayer, { YoutubeIframeRef } from "react-native-youtube-iframe";
import { Feather } from "@expo/vector-icons";
import { baseUrl } from "@/api/mediaDB";

interface VideoTrailerProps {
  videoId?: string;
  thumbnailUrl: string | undefined;
}

const VideoTrailer: React.FC<VideoTrailerProps> = ({
  videoId,
  thumbnailUrl,
}) => {
  const playerRef = useRef<YoutubeIframeRef>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMute, setIsMute] = useState(true);

  useEffect(() => {
    setIsPlaying(true);
    setIsMute(false);
  }, []);

  return (
    <View className="mt-8 mx-2.5 overflow-hidden rounded-xl">
      {videoId ? (
        <>
          <YoutubePlayer
            ref={playerRef}
            height={210}
            play={isPlaying}
            mute={isMute}
            videoId={videoId}
            initialPlayerParams={{
              controls: false,
              iv_load_policy: 3,
              showClosedCaptions: false,
              loop: true,
              rel: false,
            }}
            onChangeState={(state) => {
              if (state === "ended") {
                playerRef.current?.seekTo(0, true);
              }
            }}
          />
          <TouchableOpacity
            className="absolute bottom-2 right-1 rounded-full p-2 z-20"
            onPress={() => setIsMute(!isMute)}
          >
            {isMute ? (
              <Feather name="volume-x" size={24} color="white" />
            ) : (
              <Feather name="volume-2" size={24} color="white" />
            )}
          </TouchableOpacity>
        </>
      ) : (
        <Image
          source={{ uri: `${baseUrl}${thumbnailUrl}` }}
          style={{ width: "100%", height: 210 }}
        />
      )}
      <View className="absolute top-0 left-0 w-full h-full bg-transparent" />
    </View>
  );
};

export default VideoTrailer;
