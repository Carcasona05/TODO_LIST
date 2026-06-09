import { View, Text, Button } from "react-native";
import { router } from "expo-router";
import React from "react";

export default function Index() {
  return (
    <View>
      <Text>Welcome</Text>
      <Button title="Go to Login" onPress={() => router.replace("/(auth)/login")} />
    </View>
  );
}