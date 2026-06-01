import React from "react";
import { useAuthContext } from "../../hooks/use-auth-context";
import {Text, View, Button } from "react-native";
import { Stack } from "expo-router";
import { supabase } from "../../lib/supabase";

export default function HomeScreen() {
  const { profile } = useAuthContext();

  async function onSignoutButtonPress () {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.log ("Error Signing Out:", error.message);
    }
  }

  return (
    <View>
      <Stack.Screen options={{ headerShown: true, title: "Home" }} />
      <Text>Welcome, {profile?.full_name}!</Text>
      <Button title="Sign Out" onPress={onSignoutButtonPress} />
      
    </View>
  );
}
