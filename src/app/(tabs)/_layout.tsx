import { Tabs } from "expo-router";
import { View, useColorScheme } from "react-native";
import Colors from "../../constants/Colors";
import { BottomTabBar } from "@react-navigation/bottom-tabs";
import React from "react";
import {
  FilmIcon,
  HeartIcon,
  HomeIcon,
  TvIcon,
} from "react-native-heroicons/solid";

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        tabBarStyle: {
          backgroundColor: "rgba(0, 0, 0, 0.85)",
          position: "absolute",
          borderTopWidth: 0,
          elevation: 0,
          height: 55,
        },
        tabBarLabelStyle: {
          marginBottom: 8,
        },
      }}
      tabBar={(props) => (
        <View>
          <BottomTabBar {...props} />
        </View>
      )}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <HomeIcon size="24" strokeWidth={2} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="movies"
        options={{
          title: "Movies",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <FilmIcon size="24" strokeWidth={2} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="shows"
        options={{
          title: "Tv Shows",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <TvIcon size="24" strokeWidth={2} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: "Favorites",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <HeartIcon size="24" strokeWidth={2} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
