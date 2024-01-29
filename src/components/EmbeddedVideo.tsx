import { View } from "react-native";
import React from "react";
import { WebView } from "react-native-webview";
import * as ScreenOrientation from "expo-screen-orientation";

interface EmbeddedVideoProps {
  embedURL: string;
}
const EmbeddedVideo: React.FC<EmbeddedVideoProps> = ({ embedURL }) => {
  const handleFullScreenChange = async (isFullScreen: boolean) => {
    if (isFullScreen) {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.LANDSCAPE
      );
    } else {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.PORTRAIT
      );
    }
  };

  return (
    <View className="h-[222px]">
      <WebView
        source={{
          html: `<iframe src="${embedURL}" style="position: absolute; inset:0; width: 100%; height: 100%;" frameborder="0" allowfullscreen scrolling="no" seamless allow="autoplay" referrerpolicy="no-referrer"></iframe>`,
        }}
        className="bg-black aspect-[16/9] flex-1"
        onShouldStartLoadWithRequest={() => {
          return false;
        }}
        setSupportMultipleWindows={false}
        allowsFullscreenVideo
        onMessage={(event) => {
          const data = JSON.parse(event.nativeEvent.data);
          if (data.fullscreen) {
            handleFullScreenChange(data.isFullScreen);
          }
        }}
        injectedJavaScript={`
          document.addEventListener("fullscreenchange", function() {
            if (window.ReactNativeWebView.postMessage) {
              window.ReactNativeWebView.postMessage(
                JSON.stringify({
                  fullscreen: true,
                  isFullScreen: document.fullscreenElement !== null,
                })
              );
            }
          });
        `}
      />
    </View>
  );
};

export default EmbeddedVideo;
