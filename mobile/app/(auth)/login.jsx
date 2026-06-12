import { View, TextInput, TouchableOpacity, Text, Alert } from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import React from "react";
import API from "../../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
     const res = await API.post("/auth/login", { email, password });
     
     const token = res.data?.session?.access_token;
     
     await AsyncStorage.setItem("token", token);
      
      Alert.alert("Success", "Logged in!");
      router.push("/(module)/home");
    } catch (err) {
      Alert.alert("Error", err.response?.data?.error || "Login failed");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput placeholder="Email" onChangeText={setEmail} style={styles.input} />
      <TextInput placeholder="Password" secureTextEntry onChangeText={setPassword} style={styles.input} />

      <TouchableOpacity onPress={handleLogin} style={styles.button}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/register")} style={styles.button}>
        <Text style={styles.buttonText}>Go to Register</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = {
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 12,
    marginBottom: 12,
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