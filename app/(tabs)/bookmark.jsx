import { View, Text, ScrollView, RefreshControl } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import SearchInput from "@/components/SearchInput";
import AsyncStorage from "@react-native-async-storage/async-storage";
import VideoCard from "@/components/VideoCard";
import EmptySavedState from "@/components/EmptySavedState";

const Bookmark = () => {
  const [savedCards, setSavedCards] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchSavedCards = async () => {
    const savedCards = await AsyncStorage.getItem("likedVideoCards");
    if (savedCards) {
      setSavedCards(JSON.parse(savedCards));
    }
  };

  useEffect(() => {
    fetchSavedCards();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchSavedCards();
    setRefreshing(false);
  };
  return (
    <SafeAreaView className="bg-primary h-full px-4">
      <ScrollView className="my-6">
        <RefreshControl
          onRefresh={onRefresh}
          refreshing={refreshing}
          className="text-white"
          colors={["#fff", "#eee"]}
          tintColor="#fff"
        />
        <Text className="text-2xl text-white font-psemibold mb-6">
          Saved Videos
        </Text>
        <SearchInput />

        <View className="flex flex-col items-center mt-8 w-full">
          {savedCards.length > 0 ? (
            savedCards.map((card, index) => <VideoCard key={index} {...card} />)
          ) : (
            <EmptySavedState
              title="No saved video"
              subtitle="Please go back home to save a video"
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Bookmark;
