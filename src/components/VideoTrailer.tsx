import React, { useEffect, useRef, useState } from "react";
import { View, TouchableOpacity, Image } from "react-native";
import YoutubePlayer, { YoutubeIframeRef } from "react-native-youtube-iframe";
import { Feather } from "@expo/vector-icons";
import { baseUrl } from "@/api/media";

interface VideoTrailerProps {
  videoId?: string;
  thumbnailUrl: string | undefined;
  outerViewClasses?: string;
  playerHeight: number;
  controlsEnabled: boolean;
  isOverlay: boolean;
}

const VideoTrailer: React.FC<VideoTrailerProps> = ({
  videoId,
  thumbnailUrl,
  outerViewClasses,
  playerHeight,
  controlsEnabled,
  isOverlay,
}) => {
  const playerRef = useRef<YoutubeIframeRef>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isVideoPlayable, setIsVideoPlayable] = useState(true);
  const [isMute, setIsMute] = useState(true);

  useEffect(() => {
    setIsPlaying(true);
    setIsMute(true);
  }, []);

  return (
    <View className={outerViewClasses}>
      {videoId && isVideoPlayable ? (
        <>
          <YoutubePlayer
            ref={playerRef}
            height={playerHeight}
            play={isPlaying}
            mute={isMute}
            videoId={videoId}
            initialPlayerParams={{
              controls: controlsEnabled,
              iv_load_policy: 3,
              showClosedCaptions: false,
              loop: true,
              rel: false,
            }}
            onError={() => setIsVideoPlayable(false)}
            onChangeState={(state) => {
              if (state === "ended") {
                playerRef.current?.seekTo(0, true);
              }
            }}
          />
          {isOverlay && (
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
          )}
        </>
      ) : (
        <Image
          source={{ uri: `${thumbnailUrl}` }}
          style={{ width: "100%", height: 210 }}
        />
      )}
      {isOverlay && (
        <View className="absolute top-0 left-0 w-full h-full bg-transparent" />
      )}
    </View>
  );
};

export default VideoTrailer;
