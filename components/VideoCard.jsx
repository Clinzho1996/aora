import { useEffect, useState } from "react";
import { ResizeMode, Video } from "expo-av";
import { View, Text, TouchableOpacity, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { icons } from "../constants";
import { Ionicons } from "@expo/vector-icons";

const VideoCard = ({ title, users, avatar, thumbnail, video }) => {
  const [play, setPlay] = useState(false);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const fetchLikedState = async () => {
      const savedCards = await AsyncStorage.getItem("likedVideoCards");

      if (savedCards) {
        const parsedCards = JSON.parse(savedCards);
        const isLiked = parsedCards.some(
          (card) =>
            card.title === title &&
            card.video === video &&
            card.thumbnail === thumbnail
        );

        setLiked(isLiked);
      }
    };

    fetchLikedState();
  }, [title, video, thumbnail]);

  const handleLike = async () => {
    setLiked((prevLiked) => !prevLiked);

    const savedCards = await AsyncStorage.getItem("likedVideoCards");
    let parsedCards = savedCards ? JSON.parse(savedCards) : [];

    if (!liked) {
      // Add the card to local storage
      parsedCards.push({ title, users, avatar, thumbnail, video });
    } else {
      // Remove the card from local storage
      parsedCards = parsedCards.filter(
        (card) => !(card.title === title && card.video === video)
      );
    }

    await AsyncStorage.setItem("likedVideoCards", JSON.stringify(parsedCards));
  };

  return (
    <View className="flex flex-col items-center px-4 mb-14">
      <View className="flex flex-row gap-3 items-start">
        <View className="flex justify-center items-center flex-row flex-1">
          <View className="w-[46px] h-[46px] rounded-lg border border-secondary flex justify-center items-center p-0.5">
            <Image
              source={{ uri: avatar }}
              className="w-full h-full rounded-lg text-white"
              resizeMode="cover"
            />
          </View>

          <View className="flex justify-center flex-1 ml-3 gap-y-1">
            <Text
              className="font-psemibold text-sm text-white"
              numberOfLines={1}
            >
              {title}
            </Text>
            <Text
              className="text-xs text-gray-100 font-pregular"
              numberOfLines={1}
            >
              {users}
            </Text>
          </View>
        </View>

        <View className="pt-2">
          <TouchableOpacity onPress={handleLike}>
            <Ionicons
              name={liked ? "heart" : "heart-outline"}
              color={liked ? "red" : "#fff"}
              size={20}
            />
          </TouchableOpacity>
        </View>
      </View>

      {play ? (
        <Video
          source={{ uri: video }}
          className="w-full h-60 rounded-xl mt-3"
          resizeMode={ResizeMode.CONTAIN}
          useNativeControls
          shouldPlay
          onPlaybackStatusUpdate={(status) => {
            if (status.didJustFinish) {
              setPlay(false);
            }
          }}
        />
      ) : (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setPlay(true)}
          className="w-full h-60 rounded-xl mt-3 relative flex justify-center items-center"
        >
          <Image
            source={{ uri: thumbnail }}
            className="w-full h-full rounded-xl mt-3"
            resizeMode="cover"
          />

          <Image
            source={icons.play}
            className="w-12 h-12 absolute"
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default VideoCard;
