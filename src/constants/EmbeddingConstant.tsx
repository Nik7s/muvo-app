import { WebView } from "react-native-webview";

import { View, Text } from "react-native";
import React from "react";

export default function EmbeddingConstant() {
  const handleShouldStartLoadWithRequest = (event: { url: any }) => {
    const { url } = event;
    if (url.includes("https://www.2embed.cc/embed/1668")) {
      return false;
    }
    return true;
  };
  return (
    <View>
      <WebView
        source={{
          html: '<div style="position: relative; padding-bottom: 56.29%; max-width: 100%; display: block; margin: 0 auto; overflow: hidden;"><iframe src="https://www.2embed.cc/embed/609681" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" frameborder="0" allowfullscreen scrolling="no" seamless allow="autoplay" referrerpolicy="no-referrer"></iframe></div>',
        }}
        onShouldStartLoadWithRequest={handleShouldStartLoadWithRequest}
        style={{ marginTop: 20 }}
      />
    </View>
  );
}
