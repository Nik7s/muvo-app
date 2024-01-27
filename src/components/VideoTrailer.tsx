import React, { useEffect, useRef, useState } from "react";
import { View, TouchableOpacity, Image } from "react-native";
import YoutubePlayer, { YoutubeIframeRef } from "react-native-youtube-iframe";
import { Feather } from "@expo/vector-icons";
import * as ScreenOrientation from "expo-screen-orientation";
interface VideoTrailerProps {
  videoId?: string;
  thumbnailUrl: string | undefined;
  outerViewClasses?: string;
  playerHeight: number;
  controlsEnabled: boolean;
  isOverlay: boolean;
  isMuted: boolean;
}

const VideoTrailer: React.FC<VideoTrailerProps> = ({
  videoId,
  thumbnailUrl,
  outerViewClasses,
  playerHeight,
  controlsEnabled,
  isOverlay,
  isMuted,
}) => {
  const playerRef = useRef<YoutubeIframeRef>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isVideoPlayable, setIsVideoPlayable] = useState(true);
  const [isMute, setIsMute] = useState(isMuted);

  useEffect(() => {
    setIsPlaying(true);
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
            onFullScreenChange={async (isFullScreen) => {
              if (isFullScreen) {
                await ScreenOrientation.lockAsync(
                  ScreenOrientation.OrientationLock.LANDSCAPE
                );
              } else {
                await ScreenOrientation.lockAsync(
                  ScreenOrientation.OrientationLock.PORTRAIT
                );
              }
            }}
          />
          {isOverlay && (
            <TouchableOpacity
              className="absolute bottom-0 right-0 rounded-full p-3 z-20"
              onPress={() => setIsMute(!isMute)}
            >
              <Feather
                name={isMute ? "volume-x" : "volume-2"}
                size={24}
                color="white"
              />
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
