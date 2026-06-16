import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import React from "react";

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>TODO LIST + AI</Text>
      <TouchableOpacity style={styles.button} onPress={() => router.replace("/(module)/home")}>
        <Text style={styles.buttonText}>Go to Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = {
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 25,
    fontWeight: "bold"
  },
  
  button: {
  backgroundColor: "#3b82f6",
  padding: 14,
  borderRadius: 8,
  alignItems: "center",
  marginBottom: 10,
},

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
};