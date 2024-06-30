import { View, Text } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const Bookmark = () => {
  return (
    <SafeAreaView className="bg-primary h-full px-4">
      <View className="">
        <Text className="text-3xl text-white">Bookmark</Text>
      </View>
    </SafeAreaView>
  );
};

export default Bookmark;
