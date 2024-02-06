import {
  fallbackThumbnailImage,
  fetchTVorMovieDetailsByID,
  image342,
} from "@/api/media";
import { FIREBASE_AUTH, FIRESTORE_DB } from "@/firebase-config";
import { AntDesign, Entypo, Feather } from "@expo/vector-icons";
import { router, usePathname } from "expo-router";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MarqueeView from "react-native-marquee-view";
import RBSheet from "react-native-raw-bottom-sheet";

const { height } = Dimensions.get("window");

interface WatchlistItemProps {
  item: {
    mediaId: string;
    mediaType: string;
  };
}

const WatchlistScreen = () => {
  const auth = FIREBASE_AUTH;
  const userId = auth.currentUser?.uid;
  const [watchlist, setWatchlist] = useState<WatchlistItemProps["item"][]>([]);
  const pathname = usePathname();

  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        const userRef = userId ? doc(FIRESTORE_DB, "Users", userId) : null;
        if (!userRef) {
          console.error("User ID is undefined");
          return;
        }

        const userDoc = await getDoc(userRef);
        if (!userDoc.exists()) {
          console.error("User document not found");
          return;
        }

        const watchlistArray = userDoc.data().watchlist || [];

        const watchlistData = await Promise.all(
          watchlistArray.map(async (docId: string) => {
            const watchlistDocRef = doc(FIRESTORE_DB, "WatchList", docId);
            const watchlistDoc = await getDoc(watchlistDocRef);
            return watchlistDoc.data();
          })
        );

        setWatchlist(watchlistData);
      } catch (error) {
        console.error("Error fetching watchlist:", error);
      }
    };

    if (userId) {
      fetchWatchlist();
    }
  }, [userId, pathname]);

  return (
    <ScrollView showsVerticalScrollIndicator={false} className="space-y-2 px-3">
      <Text className="font-semibold text-xl text-white">Your WatchList</Text>
      {watchlist.length != 0 ? (
        <View className="flex-row flex-wrap justify-between">
          {watchlist.map((item, index) => (
            <WatchlistItem key={index} item={item} />
          ))}
        </View>
      ) : (
        <Text className="text-neutral-300">
          It looks like you haven't added anything yet. Start building your
          collection now to access them easily. 🚀
        </Text>
      )}
    </ScrollView>
  );
};

const WatchlistItem: React.FC<WatchlistItemProps> = ({ item }) => {
  const [isWatchlist, setIsWatchlist] = useState(false);
  const [data, setData] = useState<{
    backdrop_path?: string;
    name?: string;
    title?: string;
  }>();
  const auth = FIREBASE_AUTH;
  const userId = auth.currentUser?.uid;
  const watchlistRef = collection(FIRESTORE_DB, "WatchList");
  const bottomSheetRef = useRef<RBSheet>(null);

  const checkWatchlist = useCallback(async () => {
    const watchlistQuery = query(
      watchlistRef,
      where("userId", "==", userId),
      where("mediaId", "==", item.mediaId),
      where("mediaType", "==", item.mediaType)
    );

    try {
      const querySnapshot = await getDocs(watchlistQuery);
      setIsWatchlist(!querySnapshot.empty);
    } catch (error) {
      console.error("Error checking watchlist:", error);
    }
  }, [userId, item, isWatchlist, setIsWatchlist, watchlistRef]);

  useEffect(() => {
    checkWatchlist();
  }, [checkWatchlist]);

  useEffect(() => {
    const getDetails = async () => {
      try {
        const data = await fetchTVorMovieDetailsByID(
          item.mediaType,
          item.mediaId
        );
        setData(data);
      } catch (error) {
        console.error("Error fetching media details:", error);
      }
    };

    getDetails();
  }, [item.mediaType, item.mediaId]);

  const handleRemoveFromWatchlist = async () => {
    try {
      const userRef = userId ? doc(FIRESTORE_DB, "Users", userId) : null;
      if (!userRef) return;
      const userDoc = await getDoc(userRef);
      if (!userDoc.exists()) return;
      const watchlistArray = userDoc.data().watchlist || [];
      const watchlistQuery = query(
        watchlistRef,
        where("userId", "==", userId),
        where("mediaId", "==", item.mediaId),
        where("mediaType", "==", item.mediaType)
      );
      const querySnapshot = await getDocs(watchlistQuery);

      if (!querySnapshot.empty) {
        const docRef = querySnapshot.docs[0].ref;
        await deleteDoc(docRef);
      }
      const updatedWatchlist = watchlistArray.filter(
        (item: string) => item !== querySnapshot.docs[0].id
      );
      await updateDoc(userRef, {
        watchlist: updatedWatchlist,
      });
      setIsWatchlist(false);
    } catch (error) {
      console.error("Error removing from watchlist:", error);
    } finally {
      bottomSheetRef.current && bottomSheetRef.current.close();
    }
  };

  const handleViewDetails = () => {
    const route =
      item.mediaType === "tv"
        ? `/streamtv/${item.mediaId}`
        : `/streammovie/${item.mediaId}`;
    router.navigate(route);
  };

  return (
    isWatchlist && (
      <View className="space-y-1 mb-2">
        <TouchableOpacity onPress={handleViewDetails}>
          <Image
            source={{
              uri: image342(data?.backdrop_path) || fallbackThumbnailImage,
            }}
            className="rounded-md aspect-video"
            style={{ height: height * 0.115 }}
          />
        </TouchableOpacity>
        <View className="flex-row justify-between">
          {(data?.name || data?.title || "").length > 20 ? (
            <MarqueeView style={{ width: 160 }}>
              <Text className="text-neutral-200 ml-1">
                {data?.name || data?.title}
              </Text>
            </MarqueeView>
          ) : (
            <Text className="text-neutral-200 ml-1">
              {data?.name || data?.title}
            </Text>
          )}
          <TouchableOpacity
            onPress={() =>
              bottomSheetRef.current && bottomSheetRef.current.open()
            }
          >
            <Entypo
              name="dots-three-vertical"
              size={14}
              color="white"
              className="p-2"
            />
          </TouchableOpacity>
        </View>
        {/* @ts-ignore */}
        <RBSheet
          ref={bottomSheetRef}
          closeOnDragDown={true}
          closeOnPressMask={true}
          height={170}
          customStyles={{
            wrapper: {
              backgroundColor: "rgba(0,0,0,0.7)",
            },
            draggableIcon: {
              display: "none",
            },
            container: {
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              backgroundColor: "rgb(16, 16, 18)",
            },
          }}
        >
          <View className="flex-row justify-between py-4 mx-5 border-b border-zinc-800">
            <Text className="text-neutral-200">
              {data?.name || data?.title}
            </Text>
            <TouchableOpacity
              onPress={() =>
                bottomSheetRef.current && bottomSheetRef.current.close()
              }
            >
              <AntDesign name="close" size={20} color="#777" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={handleViewDetails}>
            <View className="py-4 px-4 flex-row space-x-4">
              <Feather name="info" size={20} color="white" />
              <Text className="text-neutral-200">View more details</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleRemoveFromWatchlist}>
            <View className="py-4 px-4 flex-row space-x-4">
              <AntDesign name="close" size={20} color="white" />
              <Text className="text-neutral-200">Remove from Watchlist</Text>
            </View>
          </TouchableOpacity>
        </RBSheet>
      </View>
    )
  );
};

export default WatchlistScreen;
